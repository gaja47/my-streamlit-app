# Order Flow Analysis Tools — Complete Reference & Feasibility Report

A cited survey of every major order-flow / market-microstructure tool and its
charting, mapped to the data feed each requires — and what is actually
buildable on a **depth-only feed (Fyers Versova TBT: up to 50-level order-book
depth, NFO, snapshot+diffs, batched LTP/LTQ/VTT, NO individual trade prints).**

> **Method & confidence.** Compiled from 5 parallel research sweeps across
> platform docs (Sierra Chart, NinjaTrader, Bookmap, ATAS, Quantower,
> GoCharting, TradingView), microstructure literature (Lee–Ready 1991; Easley/
> López de Prado/O'Hara BVC; Ellis–Michaely–O'Hara; Gould–Bonart), exchange
> specs (CME MDP 3.0, NSE TBT/L3), and Fyers/NSE policy docs. Confidence is
> tagged **HIGH / MED / LOW**. Vendor *efficacy* claims (e.g. "divergence
> predicts reversals") are flagged as marketing, distinct from vendor docs that
> authoritatively describe *how their own tool computes a value*. Several
> primary pages (Sierra Chart, SSRN, NSE PDFs, Fyers docs) returned HTTP 403 to
> automated fetch; those points rest on consistent multi-source search extracts
> and are flagged where load-bearing.

---

## Part 0 — The data-feed taxonomy (anchors everything)

| Tier | What it carries |
|---|---|
| **L1 (top-of-book)** | Best bid/ask price + size only |
| **L2 / MBP (Market-By-Price)** | Aggregated total qty per price level, N levels (CME ~10; NSE 5/20; **Fyers up to 50**) |
| **MBO (Market-By-Order)** | Every individual order with anonymous OrderID + queue position, all levels |
| **Trade prints / Time & Sales** | Executed transactions with size, ideally an **aggressor side** — a *separate stream from depth* |

**Where Fyers sits:** L2/MBP at up to 50 levels (NFO only), snapshot then
differential updates, plus **batched** LTP, LTQ, VTT, total buy/sell qty. It
does **not** deliver a per-trade time-and-sales stream, and **no aggressor
flag** on individual trades. (HIGH — see Part 4.) This single fact is the hinge
of the entire feasibility analysis.

---

## Part 1 — Tool catalog, grouped by data source

Each entry: **what it shows · how computed · minimum data · how to read.**

### Group A — Depth / resting-order tools (read the book)

**DOM ladder / Trading DOM**
- *Shows:* resting bid/ask quantity per price level + last-trade location, live; also used for order entry.
- *Computed:* direct render of the depth book; "last trade" overlay needs a trade/LTP field.
- *Min data:* L2 depth (one level = L1). No trade prints needed to read depth. **HIGH** (Sierra Chart ChartTrading docs).
- *Read:* large resting size = potential support/resistance; watch size appear/pull as price approaches.
- *Caveat:* depth availability is feed-dependent — some feeds expose only 1 level and a "ladder" is then L1 cosplaying as L2. **HIGH.**

**Liquidity heatmap (Bookmap-style) / 3D DOM surface**
- *Shows:* the whole book over time — price (y) × time (x), color = resting size at each cell; reveals walls forming/pulling before price arrives.
- *Computed:* time-series of depth snapshots, color-scaled to a volume threshold.
- *Min data:* **L2 depth over time, no trade prints.** This is the cleanest authoritative confirmation that depth-surface tools need depth alone — Quantower's DOM-Surface KB states it is built from order-book data only. **HIGH.**
- *Read:* bright persistent bands = heavy resting liquidity (magnets/barriers); sudden disappearance = pulled liquidity.

**Order-book imbalance (multi-band, top-N)**
- *Shows:* lopsidedness of resting size, bid vs ask, over N levels.
- *Computed:* `OBI = (ΣbidQty − ΣaskQty) / (ΣbidQty + ΣaskQty)` over top N, normalized [−1,+1]. **HIGH.**
- *Min data:* L2 (N levels). No trade prints.
- *Read:* positive = bid-side pressure. Predictive **but contested**: academically a *weak-to-moderate, short-horizon* one-tick-ahead edge, strongest in large-tick instruments, degradable by spoofing (Gould–Bonart 2016). Retail "crystal ball" framing is overstated. **MED/contested.**

**Queue imbalance (L1) + microprice**
- *Shows:* top-of-book pressure; microprice = imbalance-adjusted mid.
- *Min data:* **L1 only.** No depth beyond level 1, no trades. **HIGH** (Gould–Bonart, arXiv 1512.03492).

**Absorption / refill**
- *Shows:* aggressive flow repeatedly hitting a large resting level while price fails to advance.
- *Min data — important nuance:* you can *see* a level holding/refilling on an L2 heatmap, **but confirming it absorbed real selling needs trade prints / delta** (high executed volume, little price progress). Depth alone can't distinguish "absorbed heavy selling" from "nobody traded." Industry tools combine heatmap + footprint delta. **MED — this corrects an over-claim (see Part 7).**

**Iceberg / hidden-order detection**
- *Shows:* a small displayed order that repeatedly refills after being hit (true size hidden).
- *Min data:* weakly inferable on L2 from refill-after-execution; **robust detection needs MBO** (watch one OrderID refresh). Hard limits even with MBO: hidden total size is *unknowable*, and an iceberg is *invisible until its first peak trades*. **HIGH on mechanism** (CME MBO docs; arXiv 1909.09495).
- *Read:* persistent refills at a level = institutional defense — but effectively requires execution events you don't get on Fyers.

**Spoofing / layering / liquidity pulls**
- *Shows:* non-bona-fide orders placed to fake depth then cancelled (layering = stacked across levels).
- *Min data:* **L2 order add/cancel event stream — detectable from depth churn WITHOUT trade prints.** Signatures: abnormal cancel rates, top-of-book orders cancelled first, cancelled faster as price moves toward them. Intent/regulatory proof is the hard part, not detection. **HIGH** (Do–Putniņš; arXiv 2504.15908).

### Group B — Trade / execution tools (read the tape)

**Footprint / cluster charts**
- *Shows:* inside each candle, volume traded at the bid vs at the ask, per price row. Variants: Bid×Ask, Volume, Delta (ask−bid), Imbalance, Profile.
- *Computed:* per-level `delta = askVol − bidVol`; imbalance compared **diagonally** (ask@P vs bid@P−1) against a ratio (ATAS default 150%; 2:1–4:1 common); adjacent same-side = "stacked imbalance." **HIGH.**
- *Min data:* **per-trade prints with size + reliable aggressor side.** Exact only with an exchange aggressor flag or synchronized quotes (Lee–Ready). Notably Sierra Chart's footprint "only requires best bid/ask" (not full L2) — i.e., it wants *trades classified against top-of-book*, not depth.
- *Read:* stacked buy imbalances = aggressive buyers; absorption where heavy delta meets no price progress.

**Cumulative Volume Delta (CVD)**
- *Shows:* running cumulative (askVol − bidVol) = net aggressive buying vs selling.
- *Min data:* same aggressor classification as footprint. **HIGH.**
- *Read:* **CVD/price divergence** (price new high, CVD not) = absorption/possible reversal — interpretive, *not* an academically validated predictor. **MED/marketing.**

**Bid/ask volume histogram, aggressor split** — aggregate of the above per period; same data needs.

**Time & Sales / the tape**
- *Shows:* raw per-trade prints; aggressor read by bid-hit (sell) vs offer-lift (buy). Dimensions: size, speed (prints/sec), side. Filters: ATAS Smart Tape, Bookmap large-trade dots, block filters.
- *Min data:* **true per-trade time & sales.** Specific thresholds ("5,000 shares", "200 prints/sec") are illustrative, not universal. **HIGH mechanics / MED thresholds.**

### Group C — Volume / profile / derived tools

**Market Profile / TPO (Steidlmayer, CBOT 1985)**
- *Shows:* a **time-at-price** distribution — letters (A,B,C… per 30-min bracket) stacked horizontally at each price touched. POC = most-time price; Value Area = ~70% of TPOs around POC (a *convention* proxying ±1 SD, not a true normal); VAH/VAL bound it; Initial Balance = first hour; single prints = fast moves; day types (Normal/Trend/Neutral/Double-Distribution…).
- *Min data:* **TIME-based, so buildable from periodic price-range sampling — NO traded volume needed.** **HIGH.** (Day-type frequency %s are repeated lore, not measured constants — **MED**.)

**Volume Profile (Session / Composite / Visible-Range VPVR / Fixed-Range)**
- *Shows:* horizontal histogram of **traded volume at each price**.
- *Computed:* Volume POC = highest-volume bin; Value Area = expand from POC taking the larger-volume neighbor until 70% of volume captured.
- *Min data:* **true volume-at-price wants per-trade/tick data** (Sierra Chart: "1 Tick or 1 Second" for accuracy). From coarser bars it's *approximated* by spreading bar volume across its H–L range (uniform-spread assumption — lossy on wide bars). **HIGH.**

**POC variants** — Volume-POC vs TPO-POC can differ; *developing POC* migrates intraday; *naked/virgin POC* (untested prior POC) treated as a magnet. The "~80% revisited in ~10 sessions" stat is **forum lore, unverified — LOW.**

**HVN / LVN** — High-Volume Node = acceptance/magnet/consolidation; Low-Volume Node (often <~30–40% of avg) = rejection, price moves through fast. Definitions **HIGH**; support/resistance behavior is **interpretive/MED**.

**VWAP / Anchored VWAP / SD bands**
- *Computed:* `VWAP = Σ(typicalPrice×Vol)/Σ(Vol)`, cumulative, session-reset; AVWAP starts from a chosen anchor; bands at ±1/±2/±3 volume-weighted SD.
- *Min data:* needs **volume** but only periodic price+volume (OHLCV) — **not** tick data. **HIGH.** "Overbought/oversold" band framing is interpretive.

> **FX/proxy caveat (relevant to the repo's MT5 side):** in decentralized markets (spot FX) there is no consolidated traded volume, so "volume" profiles/VWAP use *tick count*, making them proxies — closer to TPO/activity than true volume. **HIGH.**

---

## Part 2 — Aggressor classification (the layer that decides EXACT vs APPROX)

Footprint/CVD are only as good as your knowledge of *which side initiated each trade*.

1. **Exchange aggressor flag (gold standard, exact).** CME MDP 3.0 Trade Summary tag **5797 AggressorSide** (0=none,1=buy,2=sell). When present, footprint/delta are exact. **HIGH.** *(NSE retail/Fyers does NOT expose this — Part 4.)*
2. **Tick rule.** Uptick→buy, downtick→sell, zero-tick inherits prior sign. Needs only the **trade-price sequence**, no quotes. The universal fallback. **HIGH.**
3. **Lee–Ready (1991).** Quote rule (above mid=buy, below=sell) + tick rule for at-mid trades; needs **synchronized quotes + trades**. Original ~5-sec quote lag is dataset-dependent and contested in modern electronic markets. **HIGH.**
4. **Bulk Volume Classification (BVC, Easley/López de Prado/O'Hara).** Aggregates trades into equal-volume/time bars; buy-volume = `TotalVol × Z(ΔP/σ_ΔP)` (Z = normal/Student-t CDF). Outputs a **fractional buy/sell split per bar, NOT per-trade labels** — an *estimate of proportions*. Needs only bar volume + price change + a σ estimate. **HIGH method / MED params.**

**Accuracy (be skeptical — highly market- and era-dependent; do not cite one number):**

| Method | Reported accuracy | Source era/market |
|---|---|---|
| Lee–Ready | ~81–85% (orig. ~85%+, early-90s NYSE) | Lee–Ready 1991; Ellis–Michaely–O'Hara (Nasdaq) |
| Tick rule | ~77–78% (equities); ~77% BTC (69–84% daily) | EMO; Ma & Zhai (crypto) |
| Quote rule | ~76% (Nasdaq) | EMO |
| BVC | ~80% volume-classification; **often *worse* than tick rule** for aggressor side | Chakrabarty et al.; Pascual et al. |

**Sharpest contested point to foreground:** ELO's own claim that *BVC beats the
tick rule* is **not robustly replicated** — independent studies find BVC weaker
for aggressor classification (though possibly better for detecting *informed*
trading via VPIN). Treat "BVC is more accurate" as an author claim, not settled
fact. All methods fail most on **at-midpoint and large/block trades.** **HIGH that the dispute exists.**

→ **Implication for Fyers:** with no per-trade stream at all, even the tick rule
is degraded — you're classifying *batched* LTP/LTQ updates, not clean prints.
Any footprint/CVD you build is a **coarse approximation of an approximation**;
label it loudly.

---

## Part 3 — Platform landscape (what each offers + feed it needs)

| Platform | Signature order-flow tools | Feed required | Notes |
|---|---|---|---|
| **Bookmap** | Liquidity heatmap; Stops & Icebergs (MBO) | **Full L2**, + trades; premium **MBO** on CME | Heatmap quality explicitly gated on full-depth feed. Markets: CME futures, Nasdaq TotalView, crypto. |
| **ATAS** | Footprint/cluster ("400+ variants"), Smart Tape, Big Trades | **Per-trade time & sales** | Clusters "updated when new trades received." Crypto/stocks/futures, 25+ exchanges. |
| **Sierra Chart** | Numbers Bars (footprint) | **Best bid/ask + trades — NOT L2** | Denali feed offers rare *historical* market depth (~15 days, up to ~1400 levels). Cheapest tier. |
| **Quantower** | Cluster, Volume Profile, VWAP, **DOM Surface** | Footprint→trades; **DOM Surface→full L2** | KB: DOM Surface built from depth only, no trades. |
| **NinjaTrader Order Flow+** | Volumetric Bars, Cumulative Delta, Volume Profile | **bid/ask tick data; "Level II not required"** | Clearest vendor statement that footprint runs on trades, not depth. |
| **Jigsaw** | Depth & Sales ladder, Reconstructed Tape | **Full DOM + granular T&S** | Plug-in inheriting host feeds (NinjaTrader/MultiCharts/Tradovate). |
| **Exocharts** | Footprint, CVD, profile, TPO, DOM | Per-trade order-flow data | Crypto/futures, web-based. |
| **TradingView** | Volume Profile, TPO (Premium); footprint only via Pine | OHLCV; **no historical tick data** | Community footprints are real-time-only — a hard data limit. |
| **GoCharting** | Footprint, Market Profile, CVD, heatmap, DOM | NSE/BSE/MCX real-time | **The notable NSE-native order-flow platform** (the big desktop tools are US/CME-centric). |

**Cross-platform law:** *footprint/Numbers/Volumetric bars need trade prints
with aggressor classification; heatmaps/DOM-surface need full L2 depth; OHLCV
alone powers no true order-flow tool.* Pricing figures across reviews conflict
(Jigsaw $37 vs $197; Bookmap $16–99) — treat as approximate.

---

## Part 4 — NSE F&O + Fyers data reality (your hard boundary)

1. **Fyers TBT exposes DEPTH + batched LTP/LTQ/VTT — no individual trade prints, no aggressor side.** A **Fyers community feature-request (Feb 2026)** explicitly asks Fyers to *add* an individual-trade stream, noting developers "cannot reconstruct a true time-and-sales stream or accurate aggressive trade flow" and "LTQ and VTT alone don't represent individual prints because updates are often batched." **HIGH (strong negative indicator).**
2. **Real order-by-order TBT with trade side exists only on NSE's colocation MTBT multicast** (member/licensed) — not on retail APIs. Brokers convert it to aggregated depth for retail. **HIGH** (NSE MTBT spec v6.3).
3. **NSE retail tiers:** L1 (LTP), L2 (5-level), L3/"20-depth" (up to 20 levels, aggregated, **no aggressor tag**). **HIGH** (Zerodha Varsity; NSE L3 spec).
4. **Fyers "50 Market Depth"** exceeds NSE's 20-level retail product (derived from raw colo TBT), **NFO-only**, snapshot-then-diffs, ~200-symbol cap on the TBT socket. **HIGH that it exists / MED on mechanics.** *Contested:* a community repo says "real-time trade executions" — read as LTP/LTQ updates, **not** a per-trade tape (resolve toward "no individual prints").
5. **Symbols:** `NSE:`/`NFO:` prefixes (e.g. `NSE:SBIN-EQ`), full contract names — *not* the trailing-dot suffix in this repo's MT5 `python` file (that's a foreign-broker convention). **MED-HIGH.**

### ⚖️ Legal gate (resolve before any paid feed)
NSE Data Usage & Sharing Policy bars redistributing market data without a
written Relevant Agreement; Fyers API T&C separately prohibit derivative
redistribution to third parties. **Streaming Fyers/NSE-derived order-flow data
to your own subscribers likely needs a separate NSE redistribution license and
may breach Fyers' terms.** Confirm in writing first. **HIGH** (NSE policy; Fyers T&C).

---

## Part 5 — ★ FEASIBILITY MATRIX on Fyers 50-depth (the centerpiece)

**Legend:** ✅ **EXACT** (from 50-level depth alone) · 🟡 **APPROX** (inferable
from depth deltas + batched LTQ via tick-rule/BVC — label it) · ❌ **NOT
POSSIBLE** (needs per-trade prints / MBO Fyers doesn't send).

| Tool | Verdict | Why |
|---|---|---|
| DOM ladder (50-level) | ✅ EXACT | Direct depth render |
| Liquidity heatmap | ✅ EXACT | Depth snapshots over time (Quantower KB confirms depth-only) |
| 3D DOM surface | ✅ EXACT | Same as heatmap |
| Order-book imbalance (multi-band) | ✅ EXACT | Sum of resting depth; predictive value is the caveat, not the computation |
| Queue imbalance / microprice | ✅ EXACT | Top-of-book sizes |
| Liquidity walls / pulls | ✅ EXACT | Depth add/cancel over time |
| **Spoofing / layering detection** | ✅ EXACT* | **Depth add/cancel churn — no trades needed.** *Intent/proof unprovable from data alone. (New — not in current build.) |
| **Market Profile / TPO** | ✅ EXACT | **Time-at-price from periodic sampling — needs no trade volume** |
| Absorption / refill | 🟡 APPROX | Can *see* a level hold/refill; **confirming absorbed volume needs trade/delta** — was over-labeled EXACT |
| Iceberg / hidden orders | 🟡→❌ weak | Refill inference only; robust detection needs MBO + executions Fyers lacks |
| CVD (cumulative delta) | 🟡 APPROX | Tick-rule/BVC on **batched** LTP/LTQ; ~77–92% aggressor accuracy in clean markets, worse here |
| Footprint / cluster | 🟡 APPROX | Same aggressor-inference limit; coarse vs a true flag |
| Delta divergence | 🟡 APPROX | Built on approximated CVD |
| Bid/ask volume histogram | 🟡 APPROX | Aggressor split inferred |
| Volume Profile / POC / VAH-VAL | 🟡 APPROX | Volume-at-price from batched VTT distributed across range (lossy) |
| HVN / LVN nodes | 🟡 APPROX | Derived from approximate volume profile |
| VWAP / Anchored VWAP / SD bands | 🟡 APPROX | Formula exact, but volume is batched VTT not true per-trade |
| **Time & Sales (true tape)** | ❌ NOT POSSIBLE | No per-trade print stream |
| **Big-trade / block filters** | ❌ NOT POSSIBLE | Needs individual prints with size |
| **Speed-of-tape** | ❌ NOT POSSIBLE | Needs per-trade timing |
| **Per-order queue / true iceberg confirm** | ❌ NOT POSSIBLE | Needs MBO |

**The one rule:** depth-based tools are **exact and best-in-class** (50 levels
beats most retail tools); trade-based tools are **approximate or impossible**
until Fyers ships per-trade data — at which point swapping a single inference
module upgrades them all to exact. Label fidelity honestly in the UI.

---

## Part 6 — Prioritized build recommendation (depth-only)

1. **Lead with your unfair advantage — the EXACT depth tools.** Heatmap + 50-level DOM + multi-band imbalance + liquidity walls. These are genuinely best-in-class on Fyers and need no caveats.
2. **Add the two EXACT tools you're *not* yet exploiting:**
   - **TPO / Market Profile** — fully exact from periodic price sampling; high trader demand; differentiates you.
   - **Spoofing/layering & cancellation analytics** — pure depth-churn; few retail tools offer it.
3. **Capture-only first (your existing Step 1).** Record Parquet, then **replay through the UI and validate edge on YOUR Nifty/BankNifty trades** before adding approximate tools. Don't ship signals you haven't validated.
4. **Then approximate tools, clearly labelled 🟡:** Volume Profile/POC, VWAP/AVWAP, CVD (tick-rule). Show the methodology and accuracy band in-UI; never present as exact.
5. **Defer ❌ tools** (true tape, footprint-as-exact, big-trade filters) until Fyers ships per-trade data — architect the inference layer as one swappable module so the upgrade is a drop-in.
6. **Resolve the legal gate before any paid subscriber feed.**

---

## Part 7 — Corrections to the current `COVERAGE_MATRIX.md`

- **Absorption** is labelled EXACT but should be **🟡 APPROX** on a depth-only feed: depth shows a level *holding*, but confirming it *absorbed traded volume* needs delta/trade data.
- **Iceberg** is labelled "EXACT*" but should be **🟡→❌**: robust detection needs execution events / MBO Fyers doesn't provide.
- **Add Spoofing/layering detection as ✅ EXACT** — a depth-only tool currently missing from the matrix.
- **TPO** being EXACT is **confirmed correct** (time-based).
- CVD/footprint as APPROX is **confirmed correct.**

## Part 8 — Contested / unverified — verify before relying

- Order-book-imbalance predictive power: real but weak/short-horizon/regime-dependent (not a "crystal ball").
- "BVC beats tick rule" — disputed; independent replications find BVC weaker for aggressor side.
- Value-Area 70% ≈ 1 SD is a convention on a non-normal distribution.
- Day-type frequency %s and "~80% naked-POC revisit" are lore, not measured constants.
- Exact NSE 20-depth retail launch date; precise Fyers symbol caps; exact TBT segment coverage beyond NFO — confirm against live Fyers docs (`myapi.fyers.in/docsv3`) and NSE PDFs.
- The community repo's "real-time trade executions" wording — read as LTP/LTQ, not a tape.

---

## Sources (representative)

Platform docs: sierrachart.com (NumbersBars, Volume_by_Price ID=141, VWAP ID=108, TPO, ChartTrading); ninjatrader.com (Order Flow Volumetric Bars); bookmap.com (heatmap KB, MBO/Stops&Icebergs); atas.net (footprint modes); help.quantower.com (DOM Surface, Cluster); gocharting.com (cluster, market-profile, imbalance); tradingview.com (Volume Profile, CVD, VWAP, TPO support docs). Academic: Lee & Ready 1991 (Wiley); Ellis–Michaely–O'Hara (Nasdaq trade classification); Easley/López de Prado/O'Hara BVC (SSRN 1989555); Chakrabarty et al. & Pascual et al. (ScienceDirect); Ma & Zhai BTC tick-rule (SAGE); Gould & Bonart queue imbalance (arXiv 1512.03492); iceberg detection (arXiv 1909.09495); spoofing (Do–Putniņš SSRN 4525036; arXiv 2504.15908). Exchange/policy: CME MDP 3.0 Trade Summary (tag 5797); CME MBO education; NSE MTBT spec v6.3 & L3 spec; NSE Data Usage & Sharing Policy; Fyers API T&C; Fyers community feature-request (Feb 2026); marketcalls.in Fyers 50-depth & TBT protobuf tutorials; zerodha.com Varsity 20-depth; truedata.in data-tier explainers.
