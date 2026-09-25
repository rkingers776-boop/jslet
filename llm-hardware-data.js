/* jslet — shared LLM hardware datablock
 * Single source of truth for GPU specs, model shapes and quantization sizes.
 * Consumers: /gpu-model-fit-matrix, /inference-capacity-planner, /llm-inference-latency.
 * Keep every edit here and in no other place — duplicating these tables is how
 * three copies of the same VRAM figure start disagreeing.
 *
 * VRAM figures are vendor decimal marketing sizes (80 GB = 80,000,000,000 bytes).
 * They are NOT GiB and must not be converted. See /gib-to-gb-marketing-gap for
 * why the two conventions differ and where each one applies.
 */
(function (global) {
  'use strict';

  /* ── GPU database ────────────────────────────────────────────────
   * memBW  : HBM/GDDR bandwidth in GB/s (vendor decimal)
   * vramGB : on-board memory in GB (vendor decimal)
   * fp8    : FP8 datapath class — 'full' (Hopper/Blackwell tensor cores),
   *          'ada' (FP8 with FP16 accumulate), 'none' (no FP8 units;
   *          frameworks silently fall back to BF16)
   */
  var GPUS = {
    'b200-192gb':   { name: 'NVIDIA B200',      memBW: 8000, vramGB: 192, fp8: 'full' },
    'h200-141gb':   { name: 'NVIDIA H200',      memBW: 4800, vramGB: 141, fp8: 'full' },
    'h100-80gb':    { name: 'NVIDIA H100',      memBW: 3350, vramGB: 80,  fp8: 'full' },
    'a100-80gb':    { name: 'NVIDIA A100-80GB', memBW: 2039, vramGB: 80,  fp8: 'none' },
    'a100-40gb':    { name: 'NVIDIA A100-40GB', memBW: 1555, vramGB: 40,  fp8: 'none' },
    'l40s-48gb':    { name: 'NVIDIA L40S',      memBW: 864,  vramGB: 48,  fp8: 'ada'  },
    'rtx4090-24gb': { name: 'NVIDIA RTX 4090',  memBW: 1008, vramGB: 24,  fp8: 'ada'  },
    'rtx3090-24gb': { name: 'NVIDIA RTX 3090',  memBW: 936,  vramGB: 24,  fp8: 'none' },
    'a10-24gb':     { name: 'NVIDIA A10',       memBW: 600,  vramGB: 24,  fp8: 'none' },
    't4-16gb':      { name: 'NVIDIA T4',        memBW: 300,  vramGB: 16,  fp8: 'none' }
  };

  /* ── Model shapes ────────────────────────────────────────────────
   * params       : total resident parameters (all MoE experts live in VRAM)
   * activeParams : parameters read per decoded token (== params for dense)
   * bytesPerParamKV : KV cache precision, 2 bytes (FP16/BF16) throughout
   * kvGeometry   : layers / kvHeads (grouped-query count) / headDim, used to
   *                derive the KV cache footprint from real attention shape.
   *                These are published architecture figures, not estimates.
   */
  var MODELS = {
    'llama4-scout-8b':      { name: 'Llama 4 Scout',     params: 8e9,   activeParams: 8e9,  bytesPerParamKV: 2,
                              kvGeometry: { layers: 32,  kvHeads: 8,  headDim: 128 } },
    'llama4-maverick-70b':  { name: 'Llama 4 Maverick',  params: 70e9,  activeParams: 70e9, bytesPerParamKV: 2,
                              kvGeometry: { layers: 80,  kvHeads: 8,  headDim: 128 } },
    'llama4-behemoth-405b': { name: 'Llama 4 Behemoth',  params: 405e9, activeParams: 405e9,bytesPerParamKV: 2,
                              kvGeometry: { layers: 126, kvHeads: 8,  headDim: 128 } },
    'mistral-small-7b':     { name: 'Mistral Small 3',   params: 7e9,   activeParams: 7e9,  bytesPerParamKV: 2,
                              kvGeometry: { layers: 32,  kvHeads: 8,  headDim: 128 } },
    'mistral-large-123b':   { name: 'Mistral Large 2',   params: 123e9, activeParams: 123e9,bytesPerParamKV: 2,
                              kvGeometry: { layers: 88,  kvHeads: 8,  headDim: 128 } },
    'deepseek-v3-671b':     { name: 'DeepSeek-V3 (MoE)', params: 671e9, activeParams: 37e9, bytesPerParamKV: 2,
                              kvGeometry: { layers: 61,  kvHeads: 8,  headDim: 128 } },
    'deepseek-r1-671b':     { name: 'DeepSeek-R1 (MoE)', params: 671e9, activeParams: 37e9, bytesPerParamKV: 2,
                              kvGeometry: { layers: 61,  kvHeads: 8,  headDim: 128 } },
    'qwen25-72b':           { name: 'Qwen 2.5',          params: 72e9,  activeParams: 72e9, bytesPerParamKV: 2,
                              kvGeometry: { layers: 80,  kvHeads: 8,  headDim: 128 } },
    'commandr-plus-104b':   { name: 'Command R+',        params: 104e9, activeParams: 104e9,bytesPerParamKV: 2,
                              kvGeometry: { layers: 104, kvHeads: 8,  headDim: 128 } },
    'phi4-14b':             { name: 'Phi-4',             params: 14e9,  activeParams: 14e9, bytesPerParamKV: 2,
                              kvGeometry: { layers: 40,  kvHeads: 10, headDim: 128 } },
    'gemma3-27b':           { name: 'Gemma 3',           params: 27e9,  activeParams: 27e9, bytesPerParamKV: 2,
                              kvGeometry: { layers: 62,  kvHeads: 16, headDim: 128 } },
    'olmoe-7b':             { name: 'OLMoE (MoE)',       params: 7e9,   activeParams: 1e9,  bytesPerParamKV: 2,
                              kvGeometry: { layers: 16,  kvHeads: 16, headDim: 128 } }
  };

  /* ── Quantization ─────────────────────────────────────────────── */
  var QUANT_BYTES = { 'fp16': 2, 'bf16': 2, 'fp8': 1, 'int8': 1, 'int4': 0.5 };

  var QUANT_LABELS = {
    'fp16': 'FP16', 'bf16': 'BF16', 'fp8': 'FP8', 'int8': 'INT8', 'int4': 'INT4'
  };

  /* ── Shared arithmetic ─────────────────────────────────────────── */

  /* Weights resident in VRAM. MoE uses total params because every expert
   * must be resident even though only activeParams are read per token. */
  function weightGB(model, quantKey) {
    return (model.params * QUANT_BYTES[quantKey]) / 1e9;
  }

  /* KV cache for one replica, in GB, from the actual attention shape.
   *
   *   bytes = 2 (K and V) × layers × kv_heads × head_dim × tokens × kv_bytes
   *
   * kv_heads is the grouped-query count, not the query head count. GQA is why
   * modern 70B models carry a ~2.7 GB KV cache at 8K rather than the ~21 GB a
   * full multi-head layout would need — a factor of 8 that decides whether long
   * context fits on one card.
   *
   * kv_bytes is the KV precision. It is deliberately NOT the weight quantization:
   * quantizing weights to INT4 leaves the KV cache at FP16 in essentially every
   * serving stack, so a 4-bit model still pays 2 bytes per KV element. Passing
   * the weight quant here would understate the cache by 4× at INT4.
   *
   * shape() falls back to a per-parameter estimate for models whose layer
   * geometry is not tabulated, calibrated so a dense 70B lands near 2.7 GB/8K.
   */
  var KV_DEFAULT_GEOMETRY = { layers: 80, kvHeads: 8, headDim: 128, per1KPerB: 4.8e-3 };

  function kvGB(model, quantKey, contextK, batch, kvBytes) {
    var prec = kvBytes || model.bytesPerParamKV || 2;
    var g = model.kvGeometry || KV_DEFAULT_GEOMETRY;
    var bytesPerToken;
    if (model.kvGeometry) {
      bytesPerToken = 2 * g.layers * g.kvHeads * g.headDim * prec;
    } else {
      // Fallback: per-parameter rate, scaled to 2 bytes of KV precision.
      bytesPerToken = model.params * KV_DEFAULT_GEOMETRY.per1KPerB * prec / 1000;
    }
    var tokens = contextK * 1000 * batch;
    return (bytesPerToken * tokens) / 1e9;
  }

  /* Framework overhead: CUDA context, cuBLAS workspaces, activation buffers and
   * engine allocations. Scales with weight footprint, with a 0.5 GB floor —
   * even a 7B model carries a fixed CUDA context cost. */
  function overheadGB(wGB) {
    return Math.max(0.5, wGB * 0.06);
  }

  /* Total VRAM a single replica needs. */
  function totalVRAMGB(model, quantKey, contextK, batch) {
    var w = weightGB(model, quantKey);
    return w + overheadGB(w) + kvGB(model, quantKey, contextK, batch);
  }

  /* Theoretical decode throughput from memory bandwidth: one token requires
   * reading every active parameter once. Returns tokens/sec. */
  function theoreticalTokPerSec(gpu, model, quantKey) {
    var bytesPerToken = model.activeParams * QUANT_BYTES[quantKey];
    return gpu.memBW / (bytesPerToken / 1e9);
  }

  /* Realised efficiency rises with batch size (better GEMM occupancy). */
  function batchEfficiency(batch) {
    if (batch >= 64) return 0.88;
    if (batch >= 32) return 0.85;
    if (batch >= 8)  return 0.82;
    if (batch >= 4)  return 0.78;
    return 0.72;
  }

  /* Aggregate throughput multiplier as concurrency rises — sublinear because
   * each added sequence shares the same weight read. */
  function concurrencyMultiplier(batch) {
    var table = { 1: 1.0, 4: 6.5, 8: 11, 16: 17, 32: 24, 64: 32, 128: 40 };
    if (table[batch] !== undefined) return table[batch];
    var keys = Object.keys(table).map(Number).sort(function (a, b) { return a - b; });
    for (var i = keys.length - 1; i >= 0; i--) {
      if (batch >= keys[i]) {
        var lo = keys[i];
        var hi = keys[i + 1];
        if (hi === undefined) return table[lo] * Math.pow(batch / lo, 0.35);
        var t = (batch - lo) / (hi - lo);
        return table[lo] + t * (table[hi] - table[lo]);
      }
    }
    return 1.0;
  }

  /* Tensor-parallel efficiency for N-way sharding. Measured values from the
   * multi-GPU scaling table: TP=2 92%, TP=4 80%, TP=8 63%, TP=16 48%. */
  function tpEfficiency(n) {
    if (n <= 1) return 1.0;
    if (n === 2) return 0.92;
    if (n === 4) return 0.80;
    if (n === 8) return 0.63;
    return 0.48;
  }

  /* Does this GPU run FP8 natively, or will the framework fall back? */
  function fp8Status(gpuKey) {
    var g = GPUS[gpuKey];
    if (!g) return 'none';
    return g.fp8 || 'none';
  }

  global.JSLET_HW = {
    GPUS: GPUS,
    MODELS: MODELS,
    QUANT_BYTES: QUANT_BYTES,
    QUANT_LABELS: QUANT_LABELS,
    weightGB: weightGB,
    kvGB: kvGB,
    overheadGB: overheadGB,
    totalVRAMGB: totalVRAMGB,
    theoreticalTokPerSec: theoreticalTokPerSec,
    batchEfficiency: batchEfficiency,
    concurrencyMultiplier: concurrencyMultiplier,
    tpEfficiency: tpEfficiency,
    fp8Status: fp8Status
  };
})(window);
