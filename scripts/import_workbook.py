"""Extract ReVinyl's workbook into frontend content. Uses Python's standard library.

Usage: python scripts/import_workbook.py path/to/workbook.xlsx
Workbook descriptions and guide cells are data, never executable instructions.
"""

import json
import re
import sys
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
ROOT = Path(__file__).resolve().parents[1]


def read_tables(path):
    with zipfile.ZipFile(path) as archive:
        strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            strings = [
                "".join(t.text or "" for t in item.findall(".//m:t", NS))
                for item in ET.fromstring(archive.read("xl/sharedStrings.xml")).findall("m:si", NS)
            ]
        rels = {
            item.attrib["Id"]: item.attrib["Target"]
            for item in ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        }
        tables = {}
        for sheet in ET.fromstring(archive.read("xl/workbook.xml")).findall("m:sheets/m:sheet", NS):
            target = rels[sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]]
            target = target.lstrip("/") if target.startswith("/") else "xl/" + target
            rows = {}
            for row in ET.fromstring(archive.read(target)).findall("m:sheetData/m:row", NS):
                cells = {}
                for cell in row.findall("m:c", NS):
                    value = cell.find("m:v", NS)
                    value = value.text if value is not None else ""
                    if cell.attrib.get("t") == "s":
                        value = strings[int(value)]
                    elif cell.attrib.get("t") == "inlineStr":
                        value = "".join(t.text or "" for t in cell.findall(".//m:t", NS))
                    cells[re.sub(r"\d", "", cell.attrib["r"])] = value or ""
                rows[int(row.attrib["r"])] = cells
            headers = rows.get(3, {})
            tables[sheet.attrib["name"]] = [
                {key: cells.get(col, "").replace("\\n", "\n") for col, key in headers.items() if key}
                for number, cells in rows.items()
                if number > 3 and cells.get("A")
            ]
        return tables


def require(condition, message):
    if not condition:
        raise ValueError(message)


def build(tables, source):
    lookups = {}
    for sheet, kind in [("01_Artist", "artists"), ("02_Album", "albums"), ("03_Era", "eras"),
                        ("04_Genre", "genres"), ("05_Region", "regions"), ("06_Instrument", "instruments")]:
        lookups[kind] = []
        for row in tables[sheet]:
            item = {"id": f"workbook:{kind}:{row['slug']}", "slug": row["slug"], "name": row["name"]}
            if kind == "albums":
                item["title"] = row["name"]
            if kind == "eras":
                for field in ["startYear", "endYear"]:
                    if row[field]:
                        item[field] = int(row[field])
                item["translations"] = [
                    {"locale": locale, **{field: row[field + "_" + locale]
                     for field in ["title", "summary", "musicalContext"]}}
                    for locale in ["vi", "en"]
                ]
            lookups[kind].append(item)
        require(len({item['slug'] for item in lookups[kind]}) == len(lookups[kind]), f"Duplicate {kind} slug")
    indexes = {kind: {item["slug"]: item for item in items} for kind, items in lookups.items()}
    recordings = []
    for row in tables["07_Recording"]:
        slug = row["slug"]
        require(row["status"] in ["DRAFT", "PUBLISHED"], f"Invalid status: {slug}")
        record = {"id": f"workbook:recording:{slug}", "slug": slug, "status": row["status"],
                  "coverImage": row["coverImage"], "translations": [], "audio": [], "instruments": [], "references": []}
        if row["year"]:
            record["year"] = int(row["year"])
        for field, kind in [("artist", "artists"), ("album", "albums"), ("era", "eras"),
                            ("genre", "genres"), ("region", "regions")]:
            key = row[field + "_slug"]
            if key:
                require(key in indexes[kind], f"Unknown {kind} {key} in {slug}")
                record[field] = indexes[kind][key]
        recordings.append(record)
    by_slug = {record["slug"]: record for record in recordings}
    require(len(by_slug) == len(recordings), "Duplicate recording slug")
    for sheet, field in [("08_Recording_Translation", "translations"), ("09_Recording_Audio", "audio"),
                         ("10_Recording_Instrument", "instruments"), ("11_Recording_Reference", "references")]:
        for index, row in enumerate(tables[sheet]):
            slug = row["recording_slug"]
            require(slug in by_slug, f"Unknown recording {slug} in {sheet}")
            item = {key: value for key, value in row.items() if key != "recording_slug" and value != ""}
            if field == "translations":
                require(item.get("locale") in ["vi", "en"], f"Invalid locale: {slug}")
            if field == "audio":
                require(item.get("type") in ["DIGITAL", "VINYLIZED"], f"Invalid audio type: {slug}")
                item["id"] = f"workbook:audio:{index}"
            if field == "instruments":
                key = item.pop("instrument_slug")
                require(key in indexes["instruments"], f"Unknown instrument {key}")
                item["instrument"] = indexes["instruments"][key]
                if "confidence" in item:
                    item["confidence"] = float(item["confidence"])
            if field == "references":
                status = item.pop("verificationStatus", None)
                if "publishedYear" in item:
                    item["publishedYear"] = int(item["publishedYear"])
                item = {"verificationStatus": status, "reference": {"id": f"workbook:reference:{index}", **item}}
            by_slug[slug][field].append(item)
    for record in recordings:
        require(sorted(t["locale"] for t in record["translations"]) == ["en", "vi"],
                f"Expected one translation per language: {record['slug']}")
    content = {}
    for locale in ["vi", "en"]:
        content[locale] = {}
        for sheet, section in [("12_Footer", "footer"), ("13_About_Us", "about"), ("14_Contact", "contact")]:
            content[locale][section] = {row["key"]: row[locale] for row in tables[sheet]}
        about = content[locale]["about"]
        about["introParagraphs"] = [about.pop(f"introParagraph{i}") for i in [1, 2, 3]]
        contact = content[locale]["contact"]
        # This workbook puts the phone and street in label cells. Keep the supplied
        # values as contact data, and supply descriptive interface labels instead.
        street = contact["address"]
        contact["addressValue"] = f"{street}, {contact['addressValue']}"
        contact["address"] = "Địa chỉ" if locale == "vi" else "Address"
        contact["phone"] = "Điện thoại" if locale == "vi" else "Phone"
        require(contact["emailValue"] == content[locale]["footer"]["contactEmail"], "Contact email differs from footer")
        require(contact["phoneValue"] == content[locale]["footer"]["contactPhone"], "Contact phone differs from footer")
    return {"source": source, "lookups": lookups, "recordings": recordings}, content


def main():
    source = Path(sys.argv[1])
    archive, content = build(read_tables(source), source.name)
    output = ROOT / "src" / "data"
    output.mkdir(exist_ok=True)
    for name, value in [("archive-workbook.json", archive), ("website-content.json", content)]:
        (output / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(archive['recordings'])} recordings; bilingual footer, about and contact content.")


if __name__ == "__main__":
    main()
