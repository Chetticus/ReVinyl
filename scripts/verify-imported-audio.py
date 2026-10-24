"""Check uploaded audio response headers without downloading media or using credentials."""
import concurrent.futures
import datetime
import json
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "docs/admin-import-report-2026-10-23.json"
OUTPUT = ROOT / "docs/admin-audio-verification-2026-10-23.json"


def check(item):
    slug, audio = item
    result = {"slug": slug, "filename": audio["filename"], "url": audio["url"], "expectedBytes": audio["fileSize"]}
    try:
        request = urllib.request.Request(audio["url"], method="HEAD")
        with urllib.request.urlopen(request, timeout=30) as response:
            size = response.headers.get("Content-Length")
            result.update(status=response.status, contentType=response.headers.get("Content-Type"), contentLength=int(size) if size else None)
            result["sourceSizeMatchesDelivery"] = result["contentLength"] == audio["fileSize"]
            result["ok"] = response.status == 200 and result["contentType"].split(";")[0] == "audio/mpeg" and (result["contentLength"] or 0) > 0
    except Exception as error:
        result.update(ok=False, error=str(error))
    return result


if __name__ == "__main__":
    report = json.loads(REPORT.read_text(encoding="utf-8-sig"))
    assets = [(row["slug"], audio) for row in report["verified"] for audio in row["audio"]]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(check, assets))
    audit = {"checkedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(), "method": "HEAD", "total": len(results), "passed": sum(row["ok"] for row in results), "results": results}
    OUTPUT.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: audit[key] for key in ["total", "passed", "method"]}))
    for row in results:
        if not row["ok"]:
            print(json.dumps(row, ensure_ascii=True))
    raise SystemExit(0 if audit["total"] == audit["passed"] else 1)
