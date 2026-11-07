# TASK-003b: Review Reconciliation (T2: single Beta + Design Gate)
*Tech Lead | 2026-11-07 | Reviewed: uncommitted working tree on top of f919505*

| Gate | Reviewer | Verdict | Key evidence |
|------|----------|---------|--------------|
| Self-check | Alpha (sonnet/medium) | 336/336 e2e over 3 repeats; mutation checks | 2 spec targets missed (bundle 5.75 KB vs 4 KB, build 35–61 ms vs 30 ms), logged DEBT-018/019 |
| Peer review | Beta (sonnet/high) | **APPROVED**, 3 SHOULD | Independently measured contrast at 14 viewports (worst 9.99:1), loop lifecycle, DPR cap, CSP; found the side-mode scrim untested at 1440 |
| Design gate (AC-24) | UI/UX Lead (opus/high) | **CHANGES REQUIRED**, MF-1…MF-10 | Rendered 9 frames + 2× crops: the pit reads as a fingerprint/target, pixel-art blocks from unsmoothed 0.5× raster, static-like terrain, flat two-tone lighting |

## Tech Lead decisions
- All MF-1…MF-10 accepted. Realism comes from **lighting and geometry, not colour**.
- Beta SHOULD-1 (desktop contrast at 1280/1100/1024 + mutation proof): accepted.
- Beta SHOULD-2: e2e build-time bound stays 100 ms (sandbox variance), an explicit deviation. The 50 ms spec limit is a target to measure on CI hardware (DEBT-019).
- Beta SHOULD-3: contour gets an e2e smoke test now via a non-shipping fixture (DEBT-018).
- Budget: 6 KB hard limit kept. Cut order: callout "lit" state, then vehicles. Up to 7 KB pre-approved only to protect anti-aliasing/lighting.

## Observations
- **Code review and design review answer different questions.** Beta found no defects in a scene that the design gate rejected on sight. Both gates are needed for visual work; neither substitutes for the other.
- Tech Lead's own screenshot read ("fingerprint", "pixelated") matched the UI/UX diagnosis. Keep the orchestrator's visual look as a cheap pre-filter before reviews.
- 3rd consecutive task where a contrast test was not load-bearing at the tested size (TASK-001 R7, TASK-002 none, TASK-003b SHOULD-1). Rule added to the QA manager prompt candidate list: **contrast tests must run at the viewport where the protective layer matters most.**
