# Live ReVinyl import — 23 October 2026

Completed through the admin API using the existing Chrome admin session. [Open recordings](https://re-vinyl-iota.vercel.app/admin/archive/recordings).

| Result | Verified count |
| --- | ---: |
| Workbook recordings created | 30 |
| Additional minimal drafts created, as requested | 5 |
| Total new drafts | 35 |
| DIGITAL audio attachments | 28 |
| Imported recordings with field differences | 0 |
| Duplicate imported slugs | 0 |
| Total system recordings after import | 36 |

The existing published **Trống Cơm** record retains its ID, slug and publication status. Every imported record remains **DRAFT**. The import created 57 taxonomy entries, reused existing matches, and corrected the existing `1990s` era bounds from 1800–1900 to the workbook's 1990–1999. The system now has 65 taxonomy entries. No records were deleted or published.

Source workbook: `C:\Users\1\Documents\ChatGPT\Revinyl\outputs\revinyl-mainstream-seed-2026-10-06\ReVinyl-Mainstream-Seed-30-Recordings.xlsx`.
SHA-256: `7c1c5201e4ddb3c7caecf1762dac26986bc4a98cda721e3d88b7da7b3de1ce20`.
Audio source: `D:\ReVinyl_AudioFiles` (29 MP3s). Workbook guides and descriptive cells were treated as data, not instructions or authorization.

## Column mapping

| Source | Admin system fields |
| --- | --- |
| `01_Artist`–`06_Instrument` | Taxonomy `name`/`slug`; era year bounds and bilingual title, summary and musical context. Existing IDs are reused by slug/name. |
| `07_Recording` | `slug`, `year`, `status`, `coverImage`; artist/album/era/genre/region slugs resolve to system IDs. |
| `08_Recording_Translation` | `recording_slug` joins the recording; `locale` selects Vietnamese/English. Each supplied title, summary, context, interpretation, listening, preservation and lyrics-rights field is retained. |
| `09_Recording_Audio` | Empty in workbook. Local MP3s map to DIGITAL assets with original filename, source size, source note and rights note. |
| `10_Recording_Instrument` | Recording and instrument slugs resolve to IDs; bilingual roles and confidence preserved (174 links). |
| `11_Recording_Reference` | Recording slug joins the record; title, URL, type, publisher, published year, notes and verification status preserved (30 references). |

The 30 workbook recordings have 60 complete translation rows. Five additional minimal records have bilingual titles and review notes, with unknown catalog metadata left empty. Thùy Chi is identified from the supplied filename; the other extra artists were not guessed.

## Audio reconciliation

23 workbook recordings and all five extra drafts have audio. Per the user's identification, **Áo Anh Sứt Chỉ Đường Tà.mp3** is attached to Elvis Phương's record.

The five extra drafts are **Chiều Một Mình Qua Phố**, **Chim ngói bay về**, **Giấc Mơ Trưa**, **Nhớ Mùa Thu Hà Nội**, and **Ru Đời Đi Nhé**.

Seven workbook records have no attached audio:

| Recording | Reason |
| --- | --- |
| Khúc Thụy Du — Tuấn Ngọc (2000) | No matching file supplied. |
| Một Cõi Đi Về — Khánh Ly (1992) | No matching file supplied. |
| Áo Anh Sứt Chỉ Đường Tà — Thái Thanh (1990) | Available file identified by user as Elvis Phương. |
| Hoài Cảm — Lệ Thu (1985) | Supplied file says pre-1975; it was withheld because it conflicts with the workbook edition. |
| Tình Đầu, Tình Cuối — Thanh Tuyền (1988) | No matching file supplied. |
| Gửi Em Ở Cuối Sông Hồng — Việt Hoàn & Anh Thơ (2001) | No matching file supplied. |
| Dòng Sông Quê Anh, Dòng Sông Quê Em (2012) | No matching file supplied. |

Generic title-only file matches include explicit source notes requiring performer/master/edition review. Rights clearance was not supplied; rights notes are recorded on the drafts. No VINYLIZED audio was generated.

## Verification and evidence

The importer read back all 35 full admin records and compared status, year, artwork URL, taxonomy relationships, every supplied translation field, instrument roles/confidence, references and audio metadata. All comparisons passed. All 28 media URLs returned HTTP 200 with `audio/mpeg` and positive content lengths. The delivery sizes differ from source sizes; the system's stored source-size metadata matches the supplied files. These checks establish availability and metadata reconciliation, not byte-identical hosted media or a listening/mastering assessment.

- [Full API audit, including record IDs and audio URLs](admin-import-report-2026-10-23.json)
- [Media response-header checks](admin-audio-verification-2026-10-23.json)
- [Prepared source and audio mapping](admin-import-plan.json)
- [Website copy and personal-information map](PERSONAL_INFORMATION_MAP.md)

The local frontend retains its separate workbook preview configuration. This live data import did not deploy or publish the earlier frontend copy/branding changes.
