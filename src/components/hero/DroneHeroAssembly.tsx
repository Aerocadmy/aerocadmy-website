"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { preload } from "react-dom";
import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react";
import journeyStyles from "./JourneyPanel.module.css";
import { ASSETS, imageBounds, mountComponentImage } from "@/lib/assets";
import { LESSONS } from "@/lib/drone-data";

const assemblyScrollDistance = () => window.innerWidth <= 900 ? 2400 : Math.max(2400, window.innerHeight * 3.5);
const openingAssets = [ASSETS.motor, ASSETS.propeller, ASSETS.controller, ASSETS.battery, ASSETS.camera, ASSETS.arm, ASSETS.sensor, ASSETS.screw];

export const DroneHeroAssembly: React.FC = () => {
  // Fetch the first-scene parts before hydration creates their animated elements.
  openingAssets.forEach((src) => preload(src, { as: "image", fetchPriority: "high" }));

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const journeyPanelRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<SVGSVGElement>(null);

  const [activeLesson, setActiveLesson] = useState(0);
  const [isJourneyVisible, setIsJourneyVisible] = useState(false);

  // Milestone mapping
  const milestones = ["Understand", "Build", "Program", "Fly"];

  // Jump to specific step by smoothly scrolling the window
  const scrollToStep = useCallback((stepIndex: number) => {
    if (!containerRef.current) return;
    const track = containerRef.current;
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 96;
    const trackTop = track.offsetTop - navH;
    const scrollDistance = assemblyScrollDistance();
    const targetScroll = trackTop + ([.39, .95, 1.9, 2.9, 3.9, 4.95, 5.9][stepIndex] / 6) * scrollDistance;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  }, []);

  const resetJourney = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const jump = (event: Event) => scrollToStep((event as CustomEvent<number>).detail);
    window.addEventListener('aerocadmy:lesson', jump);
    return () => window.removeEventListener('aerocadmy:lesson', jump);
  }, [scrollToStep]);

  useEffect(() => {
    const heroNode = heroRef.current;
    const stageNode = stageRef.current;
    const trackNode = containerRef.current;
    const copyNode = copyRef.current;
    const orbitNode = orbitRef.current;
    if (!heroNode || !stageNode || !trackNode || !copyNode || !orbitNode) return;

    const hero: HTMLDivElement = heroNode;
    const stage: HTMLDivElement = stageNode;
    const track: HTMLDivElement = trackNode;
    const copyEl: HTMLDivElement = copyNode;
    const orbit: SVGSVGElement = orbitNode;

    let animFrameId = 0;
    let disposed = false;
    let heroInViewport = false;
    let imagesReady = false;
    const imageCleanups: Array<() => void> = [];
    const navHeight = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 96;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const sm = (t: number) => t * t * (3 - 2 * t);
    const ph = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
    const easeOutBack = (t: number) => {
      const c1 = 0.8,
        c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const W = 1600,
      H = 802;
    const C = { x: 800, y: 445 };
    const ARM_W = 380,
      MOT_W = 104,
      PLATE_W = 240,
      HOVER = 62;
    const ARM_ASP = imageBounds(ASSETS.arm).cropHeight / imageBounds(ASSETS.arm).cropWidth,
      MOT_ASP = imageBounds(ASSETS.motor).cropHeight / imageBounds(ASSETS.motor).cropWidth,
      PLATE_ASP = imageBounds(ASSETS.plate).cropHeight / imageBounds(ASSETS.plate).cropWidth;
    const IN = { x: 0.12, y: 0.7 };
    const OUT = { x: 0.845, y: 0.115 };
    const BASE = { x: 0.5, y: 0.9 };
    const MID = { x: 0.5, y: 0.5 };

    const FIN_K = 1.46;
    const FIN = { w: 504 * FIN_K, h: 368 * FIN_K, cx: 798.4, cy: 420.4 };
    const SWAP_AT = 0.83;
    const SWAP2 = 1.6;
    const BT = { x: 798.4, y: 454, w: 230, rot: -59 };
    const SWAP3 = 2.6;
    const CT = { x: 800, y: 392, w: 236, rot: -4 };
    const SWAP4 = 3.6;
    const ST = { x: 797, y: 233, w: 104, rot: 0 };
    const SWAP5 = 4.7;
    const SWAP6 = 5.45;
    const FIN5 = { w: FIN.w, h: FIN.h, cx: FIN.cx, cy: FIN.cy };
    const FINAL_DRONE_W = FIN5.w * 1.25;
    const SHIFT = 0;
    const CAM = { dx: 0, dy: 178, w: 110 };
    const BF = { x: FIN.cx, y: FIN.cy + 4, w: 170 };
    const PROP_W = 230,
      PROP_HUB = { x: 0.495, y: 0.425 };
    const mx = (x: number, y: number) => ({
      x: FIN5.cx + (x - 0.5) * FIN5.w,
      y: FIN5.cy + (y - 0.5) * FIN5.h,
    });
    const PM = [
      Object.assign(mx(0.134, 0.019), { r: -63 }),
      Object.assign(mx(0.86, 0.019), { r: 7 }),
      Object.assign(mx(0.103, 0.735), { r: 7 }),
      Object.assign(mx(0.894, 0.735), { r: -63 }),
    ];
    const ARM_H = ARM_W * ARM_ASP,
      MOT_H = MOT_W * MOT_ASP;
    const DX = (OUT.x - IN.x) * ARM_W,
      DY = (IN.y - OUT.y) * ARM_H;
    const DIRS = [
      { sx: 1, sy: 1 },
      { sx: -1, sy: 1 },
      { sx: -1, sy: -1 },
      { sx: 1, sy: -1 },
    ];

    interface PartDef {
      img?: string;
      svg?: string;
      cx: number;
      cy: number;
      w: number;
      W?: number;
      rot: number;
      from: string;
      halo?: number;
      depth: number;
      role?: string;
      z?: number;
      fx?: number;
      fy?: number;
      frot?: number;
      spin?: boolean;
      prop?: boolean;
      ctrl?: boolean;
      batt?: boolean;
      cam?: boolean;
      sens?: boolean;
      small?: boolean;
      imgAfterBattery?: string;
      tag?: { x: number; y: number; w: number; title: string; sub: string };
    }

    const parts: PartDef[] = [
      {
        img: ASSETS.motor,
        cx: 388,
        cy: 128,
        w: 96,
        W: MOT_W,
        rot: -6,
        from: "top",
        halo: 150,
        depth: 1.0,
        role: "motor",
        z: 4,
        tag: { x: 200, y: 126, w: 137, title: "Motors", sub: "Generate thrust" },
      },
      {
        img: ASSETS.propeller,
        cx: 256,
        cy: 302,
        w: 250,
        rot: 14,
        from: "left",
        halo: 230,
        depth: 1.2,
        spin: true,
        prop: true,
        fx: 200,
        fy: 175,
        frot: 26,
        tag: { x: 108, y: 333, w: 130, title: "Propellers", sub: "Create lift" },
      },
      {
        img: ASSETS.controller,
        cx: 275,
        cy: 557,
        w: 170,
        rot: 0,
        from: "bottom",
        halo: 200,
        depth: 1.1,
        fx: 225,
        fy: 615,
        frot: -14,
        ctrl: true,
        tag: { x: 57, y: 573, w: 159, title: "Flight Controller", sub: "The brain" },
      },
      {
        img: ASSETS.battery,
        cx: 1250,
        cy: 142,
        w: 205,
        rot: -3,
        from: "top",
        halo: 215,
        depth: 1.0,
        fx: 1385,
        fy: 135,
        frot: 10,
        batt: true,
        tag: { x: 1290, y: 162, w: 160, title: "Battery", sub: "Powers your ideas" },
      },
      {
        img: ASSETS.camera,
        imgAfterBattery: ASSETS.camera,
        cx: 1322,
        cy: 349,
        w: 98,
        rot: 0,
        from: "right",
        halo: 125,
        depth: 1.2,
        fx: 1445,
        fy: 345,
        frot: -10,
        cam: true,
        tag: { x: 1380, y: 323, w: 153, title: "Camera", sub: "Capture the world" },
      },
      {
        img: ASSETS.arm,
        cx: 1425,
        cy: 507,
        w: 205,
        W: ARM_W,
        rot: -2,
        from: "right",
        halo: 240,
        depth: 1.0,
        role: "arm",
        z: 2,
        tag: { x: 1415, y: 534, w: 148, title: "Frame / Arm", sub: "Structural support" },
      },
      {
        img: ASSETS.sensor,
        cx: 1243,
        cy: 652,
        w: 112,
        rot: 0,
        from: "bottom",
        halo: 150,
        depth: 1.1,
        fx: 1335,
        fy: 650,
        frot: 12,
        sens: true,
        tag: { x: 1292, y: 665, w: 156, title: "Sensors", sub: "See and stabilize" },
      },
      {
        img: ASSETS.screw,
        cx: 135,
        cy: 468,
        w: 42,
        rot: 22,
        from: "left",
        depth: 1.5,
        small: true,
        fx: 95,
        fy: 395,
        frot: 60,
      },
      {
        img: ASSETS.screw,
        cx: 395,
        cy: 700,
        w: 38,
        rot: -18,
        from: "bottom",
        depth: 1.4,
        small: true,
        fx: 440,
        fy: 735,
        frot: -70,
      },
      {
        img: ASSETS.screw,
        cx: 1415,
        cy: 631,
        w: 34,
        rot: 28,
        from: "right",
        depth: 1.4,
        small: true,
        fx: 1520,
        fy: 520,
        frot: 80,
      },
      {
        svg: "pins",
        cx: 1212,
        cy: 530,
        w: 46,
        rot: -10,
        from: "right",
        depth: 1.3,
        small: true,
        fx: 1170,
        fy: 745,
        frot: 30,
      },
    ];

    parts.forEach((p) => {
      if (!p.z) p.z = 7;
    });

    const armSrc = parts.find((p) => p.role === "arm")?.img || "";
    const motSrc = parts.find((p) => p.role === "motor")?.img || "";
    const propSrc = parts.find((p) => p.prop)?.img || "";

    // Clear previous DOM children from stage if any
    stage.innerHTML = "";

    // Insert Background grids and orbit inside stage
    const bgContainer = document.createElement("div");
    bgContainer.innerHTML = `
      <div class="dots-pattern" style="position:absolute;left:24px;top:18px;width:93px;height:138px;-webkit-mask-image:linear-gradient(135deg,#000 30%,transparent 100%);mask-image:linear-gradient(135deg,#000 30%,transparent 100%)"></div>
      <div class="grid-lines-pattern" style="position:absolute;left:1370px;top:0;width:230px;height:140px"></div>
      <div class="dots-pattern" style="position:absolute;left:1495px;top:277px;width:80px;height:70px;opacity:.8"></div>
      <div class="dots-pattern" style="position:absolute;left:1500px;top:692px;width:84px;height:64px;opacity:.8"></div>
      <div style="position:absolute;border-radius:50%;border:1.5px solid rgba(0,151,178,.07);background:rgba(24,203,150,.035);left:-250px;top:640px;width:450px;height:450px"></div>
      <div style="position:absolute;border-radius:50%;border:1.5px solid rgba(0,151,178,.07);background:rgba(24,203,150,.035);left:-120px;top:720px;width:230px;height:230px"></div>
      <div style="position:absolute;left:425px;top:130px;width:750px;height:600px;border-radius:50%;background:radial-gradient(closest-side,rgba(24,203,150,.05),transparent)"></div>
    `;
    stage.appendChild(bgContainer);

    // Orbit SVG
    const orbitClone = orbit.cloneNode(true) as SVGSVGElement;
    orbitClone.style.display = "block";
    stage.appendChild(orbitClone);

    // Floating decorative symbols
    const decosData = [
      { x: 500, y: 65, from: "top", type: "ring" },
      { x: 119, y: 240, from: "left", type: "ring" },
      { x: 320, y: 445, from: "left", type: "ring" },
      { x: 1452, y: 268, from: "right", type: "ring" },
      { x: 439, y: 240, from: "top", w: 20, type: "plus" },
      { x: 1045, y: 79, from: "top", w: 22, rot: -12, type: "plane" },
      { x: 427, y: 629, from: "bottom", w: 24, rot: 8, type: "plane" },
      { x: 428, y: 548, from: "left", w: 9, type: "dot" },
      { x: 1403, y: 293, from: "right", w: 8, type: "dot" },
      { x: 1220, y: 435, from: "right", w: 9, type: "dot" },
      { x: 1248, y: 465, from: "right", w: 9, type: "dot-b" },
      { x: 1148, y: 624, from: "bottom", w: 13, type: "dot-b" },
      { x: 500, y: 300, from: "left", w: 6, type: "dot-b" },
    ];

    const decos = decosData.map((d, i) => {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.willChange = "transform";
      el.style.opacity = "0";
      el.style.opacity = "0";
      const w = d.w || 19;
      el.style.width = w + "px";
      el.style.height = w + "px";
      el.style.left = d.x - w / 2 + "px";
      el.style.top = d.y - w / 2 + "px";

      if (d.type === "ring") {
        el.style.borderRadius = "50%";
        el.style.border = "2px solid #18CB96";
      } else if (d.type === "dot") {
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#18CB96";
      } else if (d.type === "dot-b") {
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#7fd6e6";
      } else if (d.type === "plus") {
        el.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 1v18M1 10h18" stroke="#18CB96" stroke-width="2" stroke-linecap="round"/></svg>`;
      } else if (d.type === "plane") {
        el.innerHTML = `<svg width="${w}" height="${w}" viewBox="0 0 22 22"><path d="M20 3L3 11l17 8-4-8z" fill="none" stroke="#18CB96" stroke-width="1.7" stroke-linejoin="round"/></svg>`;
      }
      stage.appendChild(el);
      return {
        el,
        x: d.x,
        y: d.y,
        rot: d.rot || 0,
        from: d.from,
        ph: Math.random() * 6.28,
        delay: 120 + i * 48,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
      };
    });

    interface AsmItem {
      el: HTMLDivElement;
      im: HTMLImageElement;
      w: number;
    }
    interface FxItem {
      el: HTMLDivElement;
      size: number;
    }

    const asm: {
      plate?: AsmItem;
      arms: AsmItem[];
      motors: AsmItem[];
      frameMotors?: AsmItem;
      final2?: AsmItem;
      final3?: AsmItem;
      final4?: AsmItem;
      body?: AsmItem;
      final5?: AsmItem;
      finalDrone?: AsmItem;
      props: AsmItem[];
      glow?: FxItem;
      pops: FxItem[];
      flash?: FxItem;
      flash2?: FxItem;
      flash3?: FxItem;
      flash4?: FxItem;
      flash5?: FxItem;
      rings: FxItem[];
    } = {
      arms: [],
      motors: [],
      props: [],
      pops: [],
      rings: [],
    };

    function mkAsm(src: string, w: number, z: number): AsmItem {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.left = "0";
      el.style.top = "0";
      el.style.opacity = "0";
      el.style.willChange = "transform, opacity";
      el.style.pointerEvents = "none";
      el.style.width = w + "px";
      el.style.backgroundColor = "transparent";
      el.style.zIndex = String(z);
      if (src === ASSETS.frameBody) {
        el.style.filter = "blur(0.55px) saturate(0.96)";
      }

      const im = mountComponentImage(el, src, w);
      el.dataset.assemblyAsset = src;
      stage.appendChild(el);
      return { el, im, w };
    }

    function mkFx(cls: string, size: number, z: number): FxItem {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.left = "0";
      el.style.top = "0";
      el.style.borderRadius = "50%";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.zIndex = String(z);

      if (cls === "pop-glow") {
        el.style.background =
          "radial-gradient(circle,rgba(24,203,150,.40),rgba(0,151,178,.16) 45%,transparent 70%)";
      } else if (cls === "flash") {
        el.style.background =
          "radial-gradient(circle,rgba(255,255,255,.95),rgba(24,203,150,.32) 38%,transparent 68%)";
      } else if (cls === "burst") {
        el.style.border = "2px solid #18CB96";
      } else if (cls === "burst seat") {
        el.style.border = "2.5px solid #0097B2";
      }
      stage.appendChild(el);
      return { el, size };
    }

    // Build Assembly elements
    asm.glow = mkFx("pop-glow", 460, 0);
    asm.pops = [mkFx("burst", 150, 6), mkFx("burst", 150, 6)];
    asm.plate = mkAsm(ASSETS.plate, PLATE_W, 1);
    asm.frameMotors = mkAsm(ASSETS.frameMotorsAttached, FIN.w, 5);
    // The bare frame stays as real animated arms, motors and plate until the battery seats.
    asm.final3 = mkAsm(ASSETS.frameController, FIN.w, 5);
    asm.final2 = mkAsm(ASSETS.frameBattery, FIN.w, 5);
    asm.final4 = mkAsm(ASSETS.frameSensor, FIN.w, 5);
    asm.final5 = mkAsm(ASSETS.frameBody, FIN5.w, 5);
    asm.finalDrone = mkAsm(ASSETS.finalDrone, FIN5.w, 8);
    asm.finalDrone.el.classList.add(journeyStyles.completedDrone);
    asm.body = mkAsm(ASSETS.body, BF.w, 2);
    // Keep the latest body, sensor and battery; complete it with the animated camera and propellers.
    asm.flash5 = mkFx("flash", 460, 9);
    asm.props = [1, 2, 3].map(() => mkAsm(propSrc, PROP_W, 7));
    asm.flash4 = mkFx("flash", 420, 9);
    asm.flash2 = mkFx("flash", 520, 6);
    asm.flash3 = mkFx("flash", 560, 8);
    asm.flash = mkFx("flash", 780, 6);
    for (let i = 1; i < 4; i++) asm.arms.push(mkAsm(armSrc, ARM_W, 2));
    for (let i = 1; i < 4; i++) asm.motors.push(mkAsm(motSrc, MOT_W, 4));
    for (let i = 0; i < 5; i++) asm.rings.push(mkFx("burst seat", 120, 6));

    const pinsSVG = `<svg viewBox="0 0 46 30" width="46" height="30" style="display:block;position:relative;z-index:2">
      <rect x="3" y="12" width="40" height="11" rx="2" fill="#2a2f33"/>
      <rect x="3" y="12" width="40" height="3.500" rx="1.500" fill="#4a5258"/>
      ${[8, 18, 28, 38]
        .map(
          (x) =>
            `<rect x="${x - 2}" y="2" width="4" height="12" rx="1" fill="#e8b84a"/><rect x="${x - 2}" y="21" width="4" height="8" rx="1" fill="#d9a53a"/>`
        )
        .join("")}
    </svg>`;

    interface NodeItem {
      p: PartDef;
      el: HTMLDivElement;
      halo: HTMLDivElement | null;
      imgEl: HTMLImageElement | null;
      tag: HTMLDivElement | null;
      h: number;
      ox: number;
      oy: number;
      rot: number;
      sc: number;
      phase: number;
      sp: number;
      delay: number;
      dur: number;
      f: number;
      vx: number;
      vy: number;
      spin0: number;
      px: number;
      py: number;
      fin?: { ax: number; ay: number; wpx: number; rt: number };
    }

    const nodes: NodeItem[] = [];

    parts.forEach((p, i) => {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.left = "0";
      el.style.top = "0";
      // Prevent parts from flashing stacked at the stage origin before positioning.
      el.style.opacity = "0";
      el.style.willChange = "transform";
      el.style.pointerEvents = "none";
      el.style.width = (p.W || p.w) + "px";
      el.style.zIndex = String(p.z);

      let halo: HTMLDivElement | null = null;
      if (p.halo) {
        halo = document.createElement("div");
        halo.style.position = "absolute";
        halo.style.left = "50%";
        halo.style.top = "50%";
        halo.style.borderRadius = "50%";
        halo.style.zIndex = "1";
        halo.style.transform = "translate(-50%,-50%)";
        halo.style.background =
          "radial-gradient(circle at 50% 50%,rgba(24,203,150,.13),rgba(0,151,178,.06) 60%,transparent 72%)";
        halo.style.transition =
          "transform .5s cubic-bezier(.2,.8,.2,1), opacity .4s";
        const hs = p.halo * ((p.W || p.w) / p.w);
        halo.style.width = halo.style.height = hs + "px";
        el.appendChild(halo);
      }

      let imgEl: HTMLImageElement | null = null;
      if (p.svg) {
        el.insertAdjacentHTML("beforeend", pinsSVG);
      } else if (p.img) {
        imgEl = mountComponentImage(el, p.img, p.W || p.w);
        imgEl.dataset.initialAsset = "true";
        el.dataset.component = p.tag?.title || p.role || 'Hardware';

      }
      stage.appendChild(el);

      let tag: HTMLDivElement | null = null;
      if (p.tag) {
        tag = document.createElement("div");
        tag.style.position = "absolute";
        tag.style.left = "0";
        tag.style.top = "0";
        tag.style.display = "flex";
        tag.style.alignItems = "flex-start";
        tag.style.gap = "11px";
        tag.style.background = "#fff";
        tag.style.border = "1px solid #e3eef0";
        tag.style.borderRadius = "14px";
        tag.style.padding = "13px 16px 12px 15px";
        tag.style.boxShadow = "0 10px 26px -14px rgba(8,28,43,.22)";
        tag.style.opacity = "0";
        tag.style.willChange = "transform, opacity";
        tag.style.whiteSpace = "nowrap";
        tag.style.minWidth = p.tag.w + "px";
        tag.style.zIndex = "8";
        tag.innerHTML = `
          <i style="width:9px;height:9px;border-radius:50%;background:#18CB96;margin-top:6px;flex:none;position:relative;display:block"></i>
          <div>
            <b style="display:block;font-size:15px;font-weight:700;color:#081C2B;line-height:1.25">${p.tag.title}</b>
            <span style="display:block;font-size:12.5px;color:#7a8a95;margin-top:2px;line-height:1.3">${p.tag.sub}</span>
          </div>
        `;
        stage.appendChild(tag);
      }

      nodes.push({
        p,
        el,
        halo,
        imgEl,
        tag,
        h: imageBounds(p.img || "") ? (p.W || p.w) * imageBounds(p.img || "").cropHeight / imageBounds(p.img || "").cropWidth : (p.W || p.w) * .6,
        ox: 0,
        oy: 0,
        rot: 0,
        sc: 1,
        phase: Math.random() * 6.28,
        sp: 0.7 + Math.random() * 0.6,
        delay: 120 + i * 58,
        dur: 1120,
        f: 0,
        vx: 0,
        vy: 0,
        spin0: 0,
        px: 0,
        py: 0,
      });
    });

    let s = 1,
      viewportH = 802,
      mobileCopyHeight = 340,
      copyTextHeight = copyEl.offsetHeight,
      mobileIntroScale = 1,
      journeyBlend = 0,
      scrollDistance = assemblyScrollDistance();

    const mobilePortrait = () => window.innerWidth <= 900 && window.innerHeight > 520;

    function positionCopy(fade = 0) {
      const mobileCopy = window.innerWidth <= 900;
      const copyScale = mobileCopy ? 1 : .82;
      const phoneCopyTop = Math.max(128, Math.min(200, (viewportH - copyTextHeight) * .36));
      copyEl.style.top = (mobilePortrait() ? phoneCopyTop : mobileCopy ? 24 : Math.max(0, (viewportH - copyTextHeight * copyScale) / 2)) + "px";
      copyEl.style.transformOrigin = "top center";
      copyEl.style.transform = `translateX(-50%) translateY(${-70 * fade}px) scale(${copyScale})`;
    }

    function fit() {
      mobileCopyHeight = (journeyPanelRef.current?.offsetHeight || 300) + 36;
      copyTextHeight = copyEl.offsetHeight;
      // Let CSS follow the visible mobile viewport as the browser toolbar hides.
      hero.style.removeProperty("height");
      viewportH = hero.clientHeight;
      scrollDistance = assemblyScrollDistance();
      if (track) track.style.height = viewportH + scrollDistance + "px";
      positionCopy();
      positionStage(journeyBlend);
    }

    function positionStage(blend: number) {
      const landscape = window.innerWidth <= 900 && window.innerHeight <= 520;
      const mobile = window.innerWidth <= 900 && !landscape;
      const mobileSceneHeight = Math.max(110, viewportH - mobileCopyHeight - 32);
      const initialScale = mobile
        ? Math.min((window.innerWidth - 32) / 900, .48)
        : Math.min((landscape ? window.innerWidth * .5 : window.innerWidth) / W, viewportH / H);
      mobileIntroScale = initialScale;
      const buildScale = mobile
        ? Math.min(
            (window.innerWidth - 32) / 1100,
            mobileSceneHeight / 820
          )
        : Math.min((window.innerWidth * 0.58) / W, (viewportH * 0.9) / H);
      s = lerp(initialScale, buildScale, blend);
      stage.style.left =
        lerp(window.innerWidth * (landscape ? .74 : .5), window.innerWidth * (mobile ? .5 : .72), blend) +
        "px";
      stage.style.top =
        lerp(
          viewportH * 0.5,
          mobile ? mobileCopyHeight + mobileSceneHeight * .54 : viewportH * 0.5,
          blend
        ) + "px";
      stage.style.transform = `translate(-50%,-50%) scale(${s})`;
    }

    window.addEventListener("resize", fit);
    const panelObserver = new ResizeObserver(fit);
    panelObserver.observe(hero);
    if (journeyPanelRef.current) panelObserver.observe(journeyPanelRef.current);
    panelObserver.observe(copyEl);
    fit();

    function scheduleFrame() {
      if (!disposed && imagesReady && heroInViewport && !document.hidden && !animFrameId) {
        animFrameId = requestAnimationFrame(frame);
      }
    }

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      heroInViewport = entry.isIntersecting;
      if (heroInViewport) {
        scheduleFrame();
      } else if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = 0;
      }
    });
    visibilityObserver.observe(hero);

    const handleDocumentVisibility = () => {
      if (document.hidden && animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = 0;
      } else {
        scheduleFrame();
      }
    };
    document.addEventListener("visibilitychange", handleDocumentVisibility);
    // The scroll track gains height after hydration; keep incoming section links aligned.
    const anchorFrameId = requestAnimationFrame(() => {
      const id = window.location.hash.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (target && !track.contains(target)) target.scrollIntoView({ behavior: "instant" });
    });

    const mouse = { x: -9999, y: -9999, nx: 0, ny: 0, on: false };
    const handlePointerMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / s;
      mouse.y = (e.clientY - r.top) / s;
      mouse.nx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ny =
        ((e.clientY - navHeight()) / Math.max(hero.clientHeight, 1) - 0.5) * 2;
      mouse.on = true;
    };
    const handlePointerLeave = () => {
      mouse.on = false;
      mouse.x = mouse.y = -9999;
      mouse.nx = mouse.ny = 0;
    };

    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerleave", handlePointerLeave);

    function entryVector(cx: number, cy: number, from: string): [number, number] {
      const pad = 420;
      const ex = (window.innerWidth / s - W) / 2 + pad,
        ey = (hero.clientHeight / s - H) / 2 + pad;
      switch (from) {
        case "left":
          return [-(cx + Math.max(ex, 0) + 120), 0];
        case "right":
          return [W - cx + Math.max(ex, 0) + 120, 0];
        case "top":
          return [0, -(cy + Math.max(ey, 0) + 120)];
        default:
          return [0, H - cy + Math.max(ey, 0) + 120];
      }
    }

    function place(
      el: HTMLElement,
      w: number,
      h: number,
      a: { x: number; y: number },
      ax: number,
      ay: number,
      sc: number,
      rot: number,
      fx: number,
      fy: number
    ) {
      el.style.transformOrigin = `${a.x * 100}% ${a.y * 100}%`;
      el.style.transform = `translate3d(${(ax - a.x * w).toFixed(2)}px,${(
        ay -
        a.y * h
      ).toFixed(2)}px,0) rotate(${rot.toFixed(2)}deg) scale(${(sc * fx).toFixed(
        4
      )},${(sc * fy).toFixed(4)})`;
    }

    const hOf = (a: AsmItem, asp: number) =>
      imageBounds(a.im.getAttribute("src") || "")
        ? a.w * imageBounds(a.im.getAttribute("src") || "").cropHeight / imageBounds(a.im.getAttribute("src") || "").cropWidth
        : a.im.naturalWidth ? (a.w * a.im.naturalHeight) / a.im.naturalWidth : a.w * asp;

    nodes.forEach((n) => {
      n.h = n.el.offsetHeight || n.h;
      const [vx, vy] = entryVector(n.p.cx, n.p.cy, n.p.from);
      n.vx = vx;
      n.vy = vy;
      n.spin0 = (n.p.from === "left" ? -1 : 1) * (n.p.small ? 150 : 55);
    });

    decos.forEach((d) => {
      const [vx, vy] = entryVector(d.x, d.y, d.from);
      d.vx = vx * 0.6;
      d.vy = vy * 0.6;
    });

    const LESSON_STARTS = [0.08, 0.4, 1, 2, 3, 4, 5];
    let previousLesson = -1, previousVisible: boolean | null = null;
    let sw = 0,
      prevHigh = false,
      tFlash = -1e9;
    let sw2 = 0,
      prevHigh2 = false,
      tFlash2 = -1e9;
    let sw3 = 0,
      prevHigh3 = false,
      tFlash3 = -1e9;
    let sw4 = 0,
      prevHigh4 = false,
      tFlash4 = -1e9;
    let sw5 = 0,
      prevHigh5 = false,
      tFlash5 = -1e9;
    let t0 = performance.now();

    function frame(now: number) {
      animFrameId = 0;
      if (disposed) return;
      const t = now - t0,
        sec = now / 1000;
      const scrollStart = track.offsetTop - navHeight();
      const p = clamp01((window.scrollY - scrollStart) / scrollDistance) * 6;

      const visible = p > .08;
      if (visible !== previousVisible) { previousVisible = visible; setIsJourneyVisible(visible); }

      let lessonIdx = 0;
      LESSON_STARTS.forEach((start, i) => {
        if (p >= start) lessonIdx = i;
      });
      if (lessonIdx !== previousLesson) { previousLesson = lessonIdx; setActiveLesson(lessonIdx); }

      journeyBlend = sm(ph(p, 0, 0.4));
      positionStage(journeyBlend);

      const q1 = ph(p, 0, 0.12);
      const e1 = sm(ph(p, 0, 0.2));
      const q2 = sm(ph(p, 0.1, 0.4));
      const q3 = ph(p, 0.4, 0.5);
      const u = sm(ph(p, 0.5, 0.76));
      const ua = sm(ph(p, 0.47, 0.7));
      const dr = sm(ph(p, 0.755, 0.83));
      const qb = sm(ph(p, 1, 1.52));
      const qc = sm(ph(p, 2, 2.52));
      const qs = sm(ph(p, 3, 3.52));
      const qf = ph(p, 4.3, 4.65),
        qfS = sm(qf);
      const qp = ph(p, 5, 5.45),
        qpS = sm(qp);
      const finalDroneVisible = p >= 5.7;
      const finalBlend = 0; // No stale full-drone photo: retain the new components.
      const fadeAll = 1 - ph(p, 5, 5.3);

      let propStart: { x: number; y: number; s: number; r: number } | null = null;

      const high5 = p >= SWAP5;
      if (high5 && !prevHigh5) tFlash5 = now;
      prevHigh5 = high5;
      sw5 += ((high5 ? 1 : 0) - sw5) * 0.8;
      if (sw5 < 0.01) sw5 = 0;
      if (sw5 > 0.99) sw5 = 1;

      const high4 = p >= SWAP4;
      if (high4 && !prevHigh4) tFlash4 = now;
      prevHigh4 = high4;
      sw4 += ((high4 ? 1 : 0) - sw4) * 0.8;
      if (sw4 < 0.01) sw4 = 0;
      if (sw4 > 0.99) sw4 = 1;

      const high3 = p >= SWAP3;
      if (high3 && !prevHigh3) tFlash3 = now;
      prevHigh3 = high3;
      sw3 += ((high3 ? 1 : 0) - sw3) * 0.8;
      if (sw3 < 0.01) sw3 = 0;
      if (sw3 > 0.99) sw3 = 1;

      const high2 = p >= SWAP2;
      if (high2 && !prevHigh2) tFlash2 = now;
      prevHigh2 = high2;
      sw2 += ((high2 ? 1 : 0) - sw2) * 0.8;
      if (sw2 < 0.01) sw2 = 0;
      if (sw2 > 0.99) sw2 = 1;

      const high = p >= SWAP_AT;
      if (high && !prevHigh) tFlash = now;
      prevHigh = high;
      sw += ((high ? 1 : 0) - sw) * 0.8;
      if (sw < 0.01) sw = 0;
      if (sw > 0.99) sw = 1;

      const gW = ph(p, 0, 0.4);
      const gx = reduce ? 0 : (mouse.nx * 10 + Math.sin(sec * 0.55) * 5) * gW;
      const gy = reduce ? 0 : (mouse.ny * 6 + Math.sin(sec * 0.9) * 7) * gW;
      const c5x = FIN5.cx - SHIFT + gx,
        c5y = FIN5.cy + gy;

      copyEl.style.opacity = (1 - q1).toFixed(3);
      positionCopy(q1);
      copyEl.inert = q1 > .5;
      copyEl.style.pointerEvents = q1 > 0.5 ? "none" : "";
      copyEl.setAttribute("aria-hidden", String(q1 > 0.5));
      const compactParts = mobilePortrait();
      orbitClone.style.opacity = compactParts ? "0" : (1 - ph(p, 0, 0.15)).toFixed(3);
      const phoneCopyTop = Math.max(128, Math.min(200, (viewportH - copyTextHeight) * .36));

      nodes.forEach((n) => {
        const p0 = n.p,
          role = p0.role;
        const e = reduce ? 1 : clamp01((t - n.delay) / n.dur);
        const eb = easeOutBack(e),
          eo = easeOut(e);
        const tx = (1 - eb) * n.vx,
          ty = (1 - eb) * n.vy;
        const eRot = (1 - eo) * n.spin0,
          eScale = 0.55 + 0.45 * eo;

        const fl = role ? 0 : e1;
        // Keep the phone's text clear, with components in upper and lower bands.
        const phoneCopyBottom = phoneCopyTop + copyTextHeight;
        const topRow = Math.min(60, phoneCopyTop * .36);
        const bottomRow = phoneCopyBottom + (viewportH - 40 - phoneCopyBottom) * .42;
        const phonePosition = role === "motor" ? { x: window.innerWidth * .17, y: topRow }
          : p0.batt ? { x: window.innerWidth * .68, y: topRow + 2 }
          : p0.prop ? { x: window.innerWidth * .43, y: phoneCopyTop - 44 }
          : p0.cam ? { x: window.innerWidth * .86, y: phoneCopyTop - 40 }
          : p0.ctrl ? { x: window.innerWidth * .18, y: bottomRow }
          : role === "arm" ? { x: window.innerWidth * .81, y: bottomRow }
          : { x: window.innerWidth * .5, y: bottomRow + 6 };
        const compactPosition = {
          x: 800 + (phonePosition.x - window.innerWidth * .5) / mobileIntroScale,
          y: 401 + (phonePosition.y - viewportH * .5) / mobileIntroScale,
        };
        const bx = compactParts
          ? lerp(compactPosition.x, 800 + ((p0.fx ?? p0.cx) - 800) * .6, fl)
          : lerp(p0.cx, p0.fx ?? p0.cx, fl);
        const by = compactParts
          ? lerp(compactPosition.y, 401 + ((p0.fy ?? p0.cy) - 401) * .7, fl)
          : lerp(p0.cy, p0.fy ?? p0.cy, fl);
        const baseRot = lerp(p0.rot, p0.frot ?? p0.rot, fl);
        const calm = role ? 1 - q2 : 1;
        const bobY = reduce
          ? 0
          : (Math.sin(sec * n.sp + n.phase) *
              ((p0.small ? 5 : 7) * calm + 30 * fl) +
              Math.cos(sec * n.sp * 0.7 + n.phase * 1.3) * 16 * fl) *
            e;
        const bobX = reduce
          ? 0
          : Math.sin(sec * n.sp * 0.6 + n.phase * 0.8) * 38 * fl * e;
        const sway = reduce
          ? 0
          : (Math.sin(sec * n.sp * 0.8 + n.phase) *
              (p0.spin ? 3.5 : 1.8) *
              calm +
              Math.sin(sec * n.sp * 0.5 + n.phase) * 10 * fl) *
            e;

        const dx = mouse.x - bx,
          dy = mouse.y - by,
          dist = Math.hypot(dx, dy);
        const R = (p0.small ? 170 : 190) + p0.w * 0.55;
        let f = reduce || e < 1 ? 0 : clamp01(1 - dist / R);
        if (role) f *= 1 - ph(p, 0, 0.08);
        const ff = f * f * (3 - 2 * f);
        n.f += (ff - n.f) * 0.12;
        const k = n.f;
        const unit = dist > 1 ? [dx / dist, dy / dist] : [0, 0];
        const tOx = unit[0] * k * (p0.small ? 22 : 26),
          tOy = unit[1] * k * (p0.small ? 22 : 26);
        n.ox += (tOx - n.ox) * 0.14;
        n.oy += (tOy - n.oy) * 0.14;
        const tRot = clamp01(Math.abs(dx) / R) * Math.sign(dx) * k * -9;
        n.rot += (tRot - n.rot) * 0.12;
        const tSc = 1 + k * (p0.small ? 0.35 : 0.14);
        n.sc += (tSc - n.sc) * 0.14;

        const px = reduce ? 0 : mouse.nx * 12 * p0.depth,
          py = reduce ? 0 : mouse.ny * 8 * p0.depth;
        n.px = (n.px || 0) + (px - (n.px || 0)) * 0.06;
        n.py = (n.py || 0) + (py - (n.py || 0)) * 0.06;

        const Wd = p0.W || p0.w,
          Hd = n.h;
        const sHero = (p0.w / Wd) * eScale * n.sc * (1 + 0.2 * fl) * (compactParts ? lerp(p0.prop ? .85 : 1.25, 1, journeyBlend) : 1);
        const rHero = baseRot + sway + n.rot + eRot;
        const cxp = bx + tx + n.ox + n.px + bobX,
          cyp = by + ty + n.oy + n.py + bobY;

        let anc = MID,
          ax = cxp,
          ay = cyp,
          sc = sHero,
          rt = rHero;
        if (role) {
          anc = role === "arm" ? IN : BASE;
          const rr = (rHero * Math.PI) / 180,
            vx = (anc.x - 0.5) * Wd * sHero,
            vy = (anc.y - 0.5) * Hd * sHero;
          ax = cxp + vx * Math.cos(rr) - vy * Math.sin(rr);
          ay = cyp + vx * Math.sin(rr) + vy * Math.cos(rr);
          let tX, tY;
          if (role === "arm") {
            tX = C.x + gx;
            tY = C.y + gy;
          } else {
            tX = C.x + DX + gx;
            tY = C.y - DY + gy - HOVER * (1 - dr);
          }
          const arc = Math.sin(Math.PI * q2) * (role === "arm" ? -45 : 60);
          ax = lerp(ax, tX, q2);
          ay = lerp(ay, tY, q2) + arc;
          sc = lerp(sHero, 1, q2);
          rt = lerp(rHero, 0, q2);
          if (n.halo) n.halo.style.opacity = (1 - q2).toFixed(3);
        }
        if (p0.batt && qb > 0) {
          const arc = -Math.sin(Math.PI * qb) * 70;
          ax = lerp(cxp, BT.x + gx, qb);
          ay = lerp(cyp, BT.y + gy, qb) + arc;
          sc = lerp(sHero, BT.w / Wd, qb);
          rt = lerp(rHero, BT.rot, qb);
          if (n.halo) n.halo.style.opacity = (1 - qb).toFixed(3);
        }
        if (p0.ctrl && qc > 0) {
          const arc = -Math.sin(Math.PI * qc) * 60;
          ax = lerp(cxp, CT.x + gx, qc);
          ay = lerp(cyp, CT.y + gy, qc) + arc;
          sc = lerp(sHero, CT.w / Wd, qc);
          rt = lerp(rHero, CT.rot, qc);
          if (n.halo) n.halo.style.opacity = (1 - qc).toFixed(3);
        }
        if (p0.sens && qs > 0) {
          const arc = -Math.sin(Math.PI * qs) * 70;
          ax = lerp(cxp, ST.x + gx, qs);
          ay = lerp(cyp, ST.y + gy, qs) + arc;
          sc = lerp(sHero, ST.w / Wd, qs);
          rt = lerp(rHero, ST.rot, qs);
          if (n.halo) n.halo.style.opacity = (1 - qs).toFixed(3);
        }
        if (p0.prop && qp > 0) {
          const T = PM[0];
          anc = PROP_HUB;
          ax = lerp(cxp, T.x + gx, qpS);
          ay = lerp(cyp, T.y + gy, qpS) - Math.sin(Math.PI * qpS) * 50;
          sc = lerp(sHero, PROP_W / Wd, qpS);
          rt = lerp(rHero, T.r, qpS);
          if (n.halo) n.halo.style.opacity = (1 - qpS).toFixed(3);
          propStart = { x: cxp, y: cyp, s: sHero * Wd, r: rHero };
        }
        if (p0.cam && qf > 0) {
          const arc = -Math.sin(Math.PI * qfS) * 60;
          ax = lerp(cxp, c5x + CAM.dx, qfS);
          ay = lerp(cyp, c5y + CAM.dy, qfS) + arc;
          sc = lerp(sHero, CAM.w / Wd, qfS);
          rt = lerp(rHero, 0, qfS);
          if (n.halo) n.halo.style.opacity = (1 - qfS).toFixed(3);
        }
        n.fin = { ax, ay, wpx: sc * Wd, rt };
        place(n.el, Wd, Hd, anc, ax, ay, sc, rt, 1, 1);
        n.el.style.opacity = (
          (compactParts && p0.small ? 0 : 1) * clamp01(e * 3.2) *
          (role
            ? (1 - sw) * (1 - sw2)
            : p0.batt
            ? 1 - sw2
            : p0.ctrl
            ? 1 - sw3
            : p0.sens
            ? 1 - sw4
            : p0.cam
            ? 1 - qfS
            : p0.prop
            ? finalDroneVisible ? 0 : 1
            : fadeAll)
        ).toFixed(3);

        if (n.tag) {
          const tg = p0.tag!;
          const lag = clamp01((t - n.delay - n.dur * 0.55) / 650);
          const lo = easeOut(lag);
          const sideDir = tg.x > W / 2 ? 1 : -1;
          n.tag.style.transform = `translate3d(${(
            tg.x +
            n.ox * 0.5 +
            n.px * 0.6 +
            (1 - lo) * 24 * sideDir
          ).toFixed(2)}px,${(
            tg.y +
            n.oy * 0.5 +
            n.py * 0.6 +
            bobY * 0.5
          ).toFixed(2)}px,0) scale(${(1 + k * 0.04).toFixed(3)})`;
          n.tag.style.opacity = (
            (compactParts ? 0 : reduce ? 1 : lo) *
            (1 - ph(p, 0, 0.06))
          ).toFixed(3);
        }
      });

      // Assembly Plate
      if (asm.plate) {
        const pl = asm.plate;
        const sP = q3 > 0 ? Math.max(0, easeOutBack(q3)) : 0;
        place(
          pl.el,
          pl.w,
          hOf(pl, PLATE_ASP),
          MID,
          C.x + gx,
          C.y + gy,
          sP,
          (1 - q3) * -30,
          1,
          1
        );
        pl.el.style.opacity = (clamp01(q3 * 5) * (1 - sw)).toFixed(3);
        pl.el.style.zIndex = p > 0.52 ? "3" : "1";
        if (asm.glow) {
          const g = asm.glow;
          place(
            g.el,
            g.size,
            g.size,
            MID,
            C.x + gx,
            C.y + gy,
            0.3 + 1.4 * q3,
            0,
            1,
            1
          );
          g.el.style.opacity = (
            q3 > 0 && q3 < 1 ? Math.sin(Math.PI * q3) * 0.9 : 0
          ).toFixed(3);
        }
        asm.pops.forEach((r, i) => {
          const b = ph(p, 0.4 + i * 0.025, 0.52 + i * 0.025);
          place(
            r.el,
            r.size,
            r.size,
            MID,
            C.x + gx,
            C.y + gy,
            0.2 + 3.2 * b,
            0,
            1,
            1
          );
          r.el.style.opacity = (b > 0 && b < 1 ? (1 - b) * 0.8 : 0).toFixed(3);
        });
      }

      // Arms multiply
      asm.arms.forEach((a, i) => {
        const d = DIRS[i + 1];
        let fx = 1,
          fy = 1;
        if (d.sx < 0 && d.sy < 0) {
          fx = Math.cos(Math.PI * clamp01(ua / 0.6));
          fy = Math.cos(Math.PI * clamp01((ua - 0.4) / 0.6));
        } else {
          if (d.sx < 0) fx = Math.cos(Math.PI * ua);
          if (d.sy < 0) fy = Math.cos(Math.PI * ua);
        }
        place(a.el, ARM_W, ARM_H, IN, C.x + gx, C.y + gy, 0.8 + 0.2 * ua, 0, fx, fy);
        a.el.style.opacity = (clamp01(ua * 6) * (1 - sw)).toFixed(3);
      });

      // Motors multiply
      const off = HOVER * (1 - dr);
      asm.motors.forEach((m, i) => {
        const d = DIRS[i + 1];
        const h0x = C.x + DX + gx,
          h0y = C.y - DY + gy - HOVER;
        const hkx = C.x + d.sx * DX + gx,
          hky = C.y - d.sy * DY + gy - off;
        const arc = Math.sin(Math.PI * u) * 55 * (i % 2 ? 1 : -1);
        place(
          m.el,
          MOT_W,
          MOT_H,
          BASE,
          lerp(h0x, hkx, u),
          lerp(h0y, hky, u) + arc,
          0.65 + 0.35 * u,
          0,
          1,
          1
        );
        m.el.style.opacity = (clamp01(u * 6) * (1 - sw)).toFixed(3);
      });

      if (asm.frameMotors) {
        const frameMotors = asm.frameMotors;
        place(frameMotors.el, FIN.w, FIN.h, MID, FIN.cx + gx, FIN.cy + gy, 1, 0, 1, 1);
        frameMotors.el.style.opacity = (sw * (1 - sw2)).toFixed(3);
      }

      // Swapped high-res photos
      if (asm.final2) {
        const g2 = asm.final2;
        place(g2.el, FIN.w, FIN.h, MID, FIN.cx + gx, FIN.cy + gy, 1, 0, 1, 1);
        g2.el.style.opacity = (sw2 * (1 - sw3)).toFixed(3);
      }
      if (asm.flash2) {
        const fl3 = clamp01(1 - (now - tFlash2) / 260),
          fs2 = asm.flash2;
        place(
          fs2.el,
          fs2.size,
          fs2.size,
          MID,
          BT.x + gx,
          BT.y + gy,
          0.7 + 0.6 * (1 - fl3),
          0,
          1,
          1
        );
        fs2.el.style.opacity = (high2 ? fl3 * 0.9 : 0).toFixed(3);
      }
      if (asm.final3) {
        const g3 = asm.final3;
        place(g3.el, FIN.w, FIN.h, MID, FIN.cx + gx, FIN.cy + gy, 1, 0, 1, 1);
        g3.el.style.opacity = (sw3 * (1 - sw4)).toFixed(3);
      }
      if (asm.final4) {
        const g4 = asm.final4;
        place(g4.el, FIN.w, FIN.h, MID, FIN.cx + gx, FIN.cy + gy, 1, 0, 1, 1);
        g4.el.style.opacity = (sw4 * (1 - sw5)).toFixed(3);
      }
      if (asm.body) {
        const bf = asm.body,
          lift = sm(ph(qf, 0, 0.5)),
          seat = sm(ph(qf, 0.5, 1));
        place(
          bf.el,
          BF.w,
          hOf(bf, 1536 / 1024),
          MID,
          BF.x + gx,
          BF.y + gy - 150 * (lift - seat),
          0.9 + 0.1 * qfS,
          0,
          1,
          1
        );
        bf.el.style.opacity = (clamp01(qf * 8) * (1 - sw5)).toFixed(3);
        bf.el.style.zIndex = qf > 0.5 ? "4" : "2";
      }
      if (asm.final5) {
        const g5 = asm.final5;
        place(g5.el, FIN5.w, FIN5.h, MID, c5x, c5y, 1, 0, 1, 1);
        g5.el.style.opacity = (sw5 * (finalDroneVisible ? 0 : 1)).toFixed(3);
      }
      if (asm.finalDrone) {
        const fd = asm.finalDrone;
        place(
          fd.el,
          FINAL_DRONE_W,
          hOf(fd, 1086 / 1448),
          MID,
          c5x,
          c5y,
          1,
          0,
          1,
          1
        );
        fd.el.style.opacity = finalDroneVisible ? "1" : "0";
        fd.el.dataset.complete = p >= 5.8 ? "true" : "false";
      }
      if (asm.flash5) {
        const fl6 = clamp01(1 - (now - tFlash5) / 260),
          fs5 = asm.flash5;
        place(
          fs5.el,
          fs5.size,
          fs5.size,
          MID,
          c5x,
          c5y,
          0.7 + 0.6 * (1 - fl6),
          0,
          1,
          1
        );
        fs5.el.style.opacity = (high5 ? fl6 * 0.9 : 0).toFixed(3);
      }
      asm.props.forEach((c, i) => {
        const T = PM[i + 1],
          st = propStart || { x: 0, y: 0, s: PROP_W, r: 0 };
        const hh = hOf(c, 0.54);
        place(
          c.el,
          PROP_W,
          hh,
          PROP_HUB,
          lerp(st.x, T.x + gx, qpS),
          lerp(st.y, T.y + gy, qpS) - Math.sin(Math.PI * qpS) * (50 + i * 12),
          lerp(st.s / PROP_W, 1, qpS),
          lerp(st.r, T.r, qpS),
          1,
          1
        );
        c.el.style.opacity = (
          clamp01(qp * 8) *
          (finalDroneVisible ? 0 : 1)
        ).toFixed(3);
      });
      if (asm.flash4) {
        const fl5 = clamp01(1 - (now - tFlash4) / 260),
          fs4 = asm.flash4;
        place(
          fs4.el,
          fs4.size,
          fs4.size,
          MID,
          ST.x + gx,
          ST.y + gy,
          0.7 + 0.6 * (1 - fl5),
          0,
          1,
          1
        );
        fs4.el.style.opacity = (high4 ? fl5 * 0.9 : 0).toFixed(3);
      }
      if (asm.flash3) {
        const fl4 = clamp01(1 - (now - tFlash3) / 260),
          fs3 = asm.flash3;
        place(
          fs3.el,
          fs3.size,
          fs3.size,
          MID,
          CT.x + gx,
          CT.y + gy,
          0.7 + 0.6 * (1 - fl4),
          0,
          1,
          1
        );
        fs3.el.style.opacity = (high3 ? fl4 * 0.9 : 0).toFixed(3);
      }
      if (asm.flash) {
        const fl2 = clamp01(1 - (now - tFlash) / 280),
          fs = asm.flash;
        place(
          fs.el,
          fs.size,
          fs.size,
          MID,
          FIN.cx + gx,
          FIN.cy + gy,
          0.7 + 0.6 * (1 - fl2),
          0,
          1,
          1
        );
        fs.el.style.opacity = (high ? fl2 * 0.9 : 0).toFixed(3);
      }
      asm.rings.forEach((r, i) => {
        const b = ph(p, SWAP_AT, SWAP_AT + 0.12);
        place(
          r.el,
          r.size,
          r.size,
          MID,
          FIN.cx + gx,
          FIN.cy + gy,
          0.5 + 5.5 * b,
          0,
          1,
          1
        );
        r.el.style.opacity = (i === 0 && b > 0 && b < 1 ? (1 - b) * 0.7 : 0).toFixed(
          3
        );
        if (i === 2) {
          const b3 = ph(p, SWAP3, SWAP3 + 0.2);
          place(
            r.el,
            r.size,
            r.size,
            MID,
            CT.x + gx,
            CT.y + gy,
            0.4 + 4.2 * b3,
            0,
            1,
            1
          );
          r.el.style.opacity = (b3 > 0 && b3 < 1 ? (1 - b3) * 0.7 : 0).toFixed(3);
        }
        if (i === 4) {
          const b5r = ph(p, SWAP5, SWAP5 + 0.2);
          place(
            r.el,
            r.size,
            r.size,
            MID,
            c5x,
            c5y,
            0.4 + 3.6 * b5r,
            0,
            1,
            1
          );
          r.el.style.opacity = (b5r > 0 && b5r < 1 ? (1 - b5r) * 0.7 : 0).toFixed(
            3
          );
        }
        if (i === 3) {
          const b4r = ph(p, SWAP4, SWAP4 + 0.2);
          place(
            r.el,
            r.size,
            r.size,
            MID,
            ST.x + gx,
            ST.y + gy,
            0.4 + 3.4 * b4r,
            0,
            1,
            1
          );
          r.el.style.opacity = (b4r > 0 && b4r < 1 ? (1 - b4r) * 0.7 : 0).toFixed(
            3
          );
        }
        if (i === 1) {
          const b2 = ph(p, SWAP2, SWAP2 + 0.2);
          place(
            r.el,
            r.size,
            r.size,
            MID,
            BT.x + gx,
            BT.y + gy,
            0.4 + 3.6 * b2,
            0,
            1,
            1
          );
          r.el.style.opacity = (b2 > 0 && b2 < 1 ? (1 - b2) * 0.7 : 0).toFixed(3);
        }
      });

      // Decos movement
      decos.forEach((d) => {
        const e = reduce ? 1 : clamp01((t - d.delay) / 1050),
          eb = easeOutBack(e);
        const dx = mouse.x - d.x,
          dy = mouse.y - d.y,
          dist = Math.hypot(dx, dy);
        const f = reduce || e < 1 ? 0 : clamp01(1 - dist / 150);
        d.ox += (-(dx / (dist || 1)) * f * 22 - d.ox) * 0.12;
        d.oy += (-(dy / (dist || 1)) * f * 22 - d.oy) * 0.12;
        const wide = 1 + e1 * 3.5;
        const driftX = reduce ? 0 : Math.sin(sec * 0.6 + d.ph) * 4 * wide,
          driftY = reduce ? 0 : Math.cos(sec * 0.5 + d.ph) * 5 * wide;
        d.el.style.opacity = clamp01(e * 2.5).toFixed(3);
        d.el.style.transform = `translate3d(${(
          (1 - eb) * d.vx +
          d.ox +
          driftX
        ).toFixed(2)}px,${((1 - eb) * d.vy + d.oy + driftY).toFixed(
          2
        )}px,0) rotate(${(
          d.rot +
          (1 - e) * 180 +
          e1 * 90 * Math.sin(d.ph)
        ).toFixed(2)}deg) scale(${(1 + f * 0.35).toFixed(3)})`;
      });

      scheduleFrame();
    }

    // Start only after image dimensions are available. Strict Mode cleanup cancels stale loads.
    const images = Array.from(stage.querySelectorAll<HTMLImageElement>('img[data-initial-asset]'));
    const ready = images.map(async (image) => {
      if (!image.complete) {
        await new Promise<void>((resolve) => {
          const done = () => {
            image.removeEventListener("load", done);
            image.removeEventListener("error", done);
            resolve();
          };
          image.addEventListener("load", done);
          image.addEventListener("error", done);
          imageCleanups.push(done);
        });
      }
      if (image.naturalWidth > 0 && typeof image.decode === "function") {
        try { await image.decode(); } catch { /* A failed image must not block the rest of the hero. */ }
      }
    });
    Promise.all(ready).then(() => {
      if (disposed) return;
      nodes.forEach(n => { n.h = n.el.offsetHeight || n.h; });
      t0 = performance.now();
      imagesReady = true;
      scheduleFrame();
    });

    return () => {
      disposed = true;
      imageCleanups.forEach(cleanup => cleanup());
      stage.replaceChildren();
      cancelAnimationFrame(animFrameId);
      cancelAnimationFrame(anchorFrameId);
      window.removeEventListener("resize", fit);
      document.removeEventListener("visibilitychange", handleDocumentVisibility);
      visibilityObserver.disconnect();
      panelObserver.disconnect();
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const currentLessonData = LESSONS[activeLesson] || LESSONS[0];

  return (
    <section className="relative w-full" ref={containerRef} id="assembly-track">
      {/* Sticky Hero Viewport */}
      <div
        ref={heroRef}
        className="drone-hero sticky top-[var(--nav-h)] w-full overflow-clip bg-[#fbfdfd]"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 52%, rgba(24,203,150,.07), transparent 70%), radial-gradient(ellipse 40% 40% at 12% 100%, rgba(0,151,178,.06), transparent 70%), #fbfdfd",
        }}
      >
        <div className="mobile-hero-atmosphere" aria-hidden="true" />
        {/* Visual Assembly Stage */}
        <div
          ref={stageRef}
          className="absolute left-1/2 top-1/2 w-[1600px] h-[802px] origin-center pointer-events-none"
        />

        {/* Orbit SVG Template (cloned into stage in useEffect) */}
        <svg
          ref={orbitRef}
          className="absolute left-0 top-0 w-[1600px] h-[802px] overflow-visible pointer-events-none"
          viewBox="0 0 1600 802"
          style={{ display: "none" }}
        >
          <path
            d="M452 96 C505 74 560 70 612 82"
            fill="none"
            stroke="#0097B2"
            strokeOpacity="0.5"
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="animate-flow-orbit"
          />
          <path
            d="M346 184 C322 225 298 255 283 276"
            fill="none"
            stroke="#18CB96"
            strokeOpacity="0.5"
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="animate-flow-orbit"
          />
          <path
            d="M150 272 C95 328 62 395 68 470 C72 505 84 535 98 548 L98 548"
            fill="none"
            stroke="#0097B2"
            strokeOpacity="0.5"
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="animate-flow-orbit"
          />
          <path
            d="M224 410 C232 440 244 468 254 498"
            fill="none"
            stroke="#18CB96"
            strokeOpacity="0.5"
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="animate-flow-orbit"
          />
          <path
            d="M338 630 C380 660 410 680 432 690"
            fill="none"
            stroke="#0097B2"
            strokeOpacity="0.5"
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="animate-flow-orbit"
          />
          <path
            d="M440 690 C520 730 660 722 820 712 C960 706 1090 700 1186 652"
            fill="none"
            stroke="#0097B2"
            strokeOpacity="0.5"
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="animate-flow-orbit"
          />
          <path
            d="M1076 82 C1110 88 1140 100 1160 112"
            fill="none"
            stroke="#0097B2"
            strokeOpacity="0.5"
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="animate-flow-orbit"
          />
          <path
            d="M1262 218 C1290 250 1300 290 1304 322"
            fill="none"
            stroke="#18CB96"
            strokeOpacity="0.5"
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="animate-flow-orbit"
          />
          <path
            d="M1278 372 C1250 392 1232 410 1226 436"
            fill="none"
            stroke="#0097B2"
            strokeOpacity="0.5"
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="animate-flow-orbit"
          />
          <path
            d="M1340 430 C1340 480 1335 520 1322 560 C1305 600 1280 612 1240 590"
            fill="none"
            stroke="#18CB96"
            strokeOpacity="0.5"
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="animate-flow-orbit"
          />
          <path
            d="M1410 112 C1428 125 1440 140 1448 150"
            fill="none"
            stroke="#0097B2"
            strokeOpacity="0.5"
            strokeWidth="1.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
            className="animate-flow-orbit"
          />
        </svg>

        {/* Center Initial Copy (fades out as user scrolls into the assembly) */}
        <div
          ref={copyRef}
          className="hero-copy absolute left-1/2 z-20 w-[700px] -translate-x-1/2 text-center pointer-events-auto"
        >
          {/* Eyebrow */}
          <div className="pt-24 sm:pt-28 flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold tracking-[0.22em] text-[#5a6b77] uppercase">
            <span className="h-0.5 w-7 rounded bg-[#18CB96]" />
            <span>UNDERSTAND · BUILD · EXPLORE</span>
            <span className="h-0.5 w-7 rounded bg-[#18CB96]" />
          </div>

          {/* Heading */}
          <h1 className="mt-4 text-[clamp(40px,4vw,64px)] font-black tracking-tight text-[#081C2B] leading-[1.12]">
            <span className="block">Curious about drones?</span>
            <span className="block text-[.82em] text-[#18CB96]">Your Journey starts here!</span>
          </h1>

          {/* Subheading */}
          <p className="mt-5 mx-auto max-w-lg text-lg sm:text-xl text-[#4a5b68] font-normal italic leading-relaxed">
            <q>Discover the drone technology, explore the science and turn your curiosity into skills that take you beyond the sky</q>
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#programs"
              className="dark-action inline-flex items-center gap-3 rounded-xl bg-[#081C2B] px-8 py-4 text-base sm:text-lg font-semibold text-white shadow-primary hover:bg-[#0b3347] hover:-translate-y-1 transition-all group"
            >
              <span>Explore Programs</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#find-your-path"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#dfe9eb] bg-white px-6 py-4 text-base sm:text-lg font-semibold text-[#081C2B] hover:border-[#18CB96] hover:text-[#0097B2] hover:-translate-y-1 transition-all"
            >
              <span>Find your starting point</span>
              <ArrowRight className="h-5 w-5 text-[#087957]" aria-hidden="true" />
            </a>
          </div>

          {/* Features list */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 border-t border-[#dfe9eb]/60 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#18CB96]/15 text-[#0097B2]">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z" />
                  <path d="M12 6v13.5" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#5b6b76] text-left leading-tight">
                Hands-on<br />learning
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#18CB96]/15 text-[#0097B2]">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#5b6b76] text-left leading-tight">
                Electronics<br />&amp; coding
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#18CB96]/15 text-[#0097B2]">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="8" r="3.5" />
                  <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
                  <path d="M16 4.5a3.5 3.5 0 010 7M18 14.3c2.2.8 3.5 2.7 3.5 5.7" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#5b6b76] text-left leading-tight">
                Career<br />guidance
              </span>
            </div>
          </div>
        </div>

        {/* Open editorial copy beside the assembly. */}
        <aside
          ref={journeyPanelRef}
          className={`${journeyStyles.panel} ${isJourneyVisible ? journeyStyles.visible : journeyStyles.hidden}`}
          aria-label="Your building journey"
          aria-hidden={!isJourneyVisible}
        >
          <div className={journeyStyles.chapter}>
            <span className={journeyStyles.chapterLabel}>The making of a drone</span>
            <span className={journeyStyles.counter}>
              <span>{String(activeLesson + 1).padStart(2, "0")}</span>
              <span className={journeyStyles.counterDivider}>/</span>
              {String(LESSONS.length).padStart(2, "0")}
            </span>
          </div>

          <div className={journeyStyles.content} key={activeLesson}>
            <p className={journeyStyles.lessonLabel}>
              <span aria-hidden="true" />{currentLessonData.label}
            </p>
            <h2>{currentLessonData.title}</h2>
            <p className={journeyStyles.description}>{currentLessonData.description}</p>
            <div className={journeyStyles.componentFocus}>
              <span className={journeyStyles.focusMark} aria-hidden="true"><span /></span>
              <span>{currentLessonData.focusComponent}</span>
            </div>
          </div>

          <ol className={journeyStyles.phases} aria-label="Learning phases">
            {milestones.map((milestone, index) => (
              <li key={milestone}
                aria-current={index === currentLessonData.milestone ? "step" : undefined}
                className={index === currentLessonData.milestone ? journeyStyles.currentPhase : index < currentLessonData.milestone ? journeyStyles.completedPhase : undefined}>
                <span className={journeyStyles.phaseIndex}>0{index + 1}</span>
                <span>{milestone}</span>
              </li>
            ))}
          </ol>

          <div className={journeyStyles.footer}>
            <span className={journeyStyles.sequence} aria-hidden="true">
              {LESSONS.map((lesson, index) => <span key={lesson.id} className={index === activeLesson ? journeyStyles.activeTick : index < activeLesson ? journeyStyles.completedTick : undefined} />)}
            </span>
            {activeLesson === LESSONS.length - 1 ? (
              <button type="button" onClick={resetJourney} tabIndex={isJourneyVisible ? 0 : -1} className={journeyStyles.replay}>
                Replay the build<RotateCcw size={14} aria-hidden="true" />
              </button>
            ) : <span className={journeyStyles.scrollHint}>Scroll to discover<ArrowDown size={14} aria-hidden="true" /></span>}
            <a href="#programs" tabIndex={isJourneyVisible ? 0 : -1} className={journeyStyles.programLink}>
              Explore programs<ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </aside>

        {/* Scroll hint helper */}
        <div
          className={`hero-scroll-cue absolute bottom-5 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-300 pointer-events-none ${
            !isJourneyVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-[#607580] shadow-sm border border-[#e3eef0] backdrop-blur-sm animate-bounce">
            <span>Scroll down to build the drone</span>
            <span>↓</span>
          </div>
        </div>
      </div>
    </section>
  );
};
