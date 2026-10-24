"""Verify published Vinylized assets against render metadata and original Digital assets."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json
from pathlib import Path
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
API = "https://nestjs-vinyl-heritage-production.up.railway.app"


def get(path):
    request = urllib.request.Request(API + path, headers={"x-tenant-id": "VINYL"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def check(item):
    record = get("/archive/recordings/" + item["slug"] + "?locale=en")
    issues = []
    vinyl = [a for a in record["audio"] if a["type"] == "VINYLIZED"]
    digital = [a for a in record["audio"] if a["type"] == "DIGITAL"]
    if len(vinyl) != 1 or len(digital) != 1:
        issues.append("Expected one asset of each type")
    if vinyl:
        asset = vinyl[0]
        if asset["originalFilename"] != item["filename"] or asset["fileSize"] != item["bytes"]:
            issues.append("Uploaded filename/source size differs from render")
        request = urllib.request.Request(asset["url"], method="HEAD", headers={"Origin": "https://re-vinyl-iota.vercel.app"})
        with urllib.request.urlopen(request, timeout=30) as response:
            headers = {"status": response.status, "mimeType": response.headers.get("Content-Type"), "deliveryBytes": int(response.headers.get("Content-Length", "0")), "allowOrigin": response.headers.get("Access-Control-Allow-Origin")}
        if headers["status"] != 200 or headers["mimeType"] != "audio/mpeg" or headers["deliveryBytes"] <= 0:
            issues.append("Audio delivery headers failed")
        if headers["allowOrigin"] not in ["*", "https://re-vinyl-iota.vercel.app"]:
            issues.append("Missing cross-origin playback permission")
    else:
        headers = None
    before = next(row for row in ORIGINAL["verified"] if row["slug"] == item["slug"])
    expected_digital = next(a for a in before["audio"] if a["type"] == "DIGITAL")
    if digital and (digital[0]["url"] != expected_digital["url"] or digital[0]["fileSize"] != expected_digital["fileSize"]):
        issues.append("Original Digital audio changed")
    return {"slug": item["slug"], "id": record["id"], "status": record["status"], "leadInSeconds": item.get("leadInSeconds", 0), "audio": record["audio"], "delivery": headers, "issues": issues}


if __name__ == "__main__":
    manifest = json.loads((ROOT / "docs/vinylized-render-manifest.json").read_text(encoding="utf-8"))
    ORIGINAL = json.loads((ROOT / "docs/admin-import-report-2026-10-23.json").read_text(encoding="utf-8-sig"))
    with ThreadPoolExecutor(max_workers=4) as pool:
        records = list(pool.map(check, manifest["records"]))
    catalog = get("/archive/recordings?locale=en&page=1&perPage=100")
    report = {"checkedAt": datetime.now(timezone.utc).isoformat(), "total": len(records), "passed": sum(not r["issues"] for r in records), "catalogTotal": catalog["total"], "mockPresent": any(r["slug"] == "trong-com" for r in catalog["data"]), "records": records}
    (ROOT / "docs/vinylized-upload-verification.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({key: value for key, value in report.items() if key != "records"}))
    for row in records:
        if row["issues"]:
            print(json.dumps({"slug": row["slug"], "issues": row["issues"]}))
    raise SystemExit(0 if report["total"] == report["passed"] else 1)
