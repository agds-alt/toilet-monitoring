/* src/app/dashboard/inspection/success/page.module.css */
/* ============================================ */
/* SUCCESS PAGE STYLES */
/* ============================================ */

.container {
  min-height: 100vh;
  padding: 20px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 100px;
}

/* ============================================ */
/* SUCCESS ANIMATION - CLEAN */
/* ============================================ */

.successAnimation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 20px;
  text-align: center;
}

.checkmark {
  width: 72px;
  height: 72px;
  animation: successZoom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes successZoom {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.checkmarkSvg {
  width: 100%;
  height: 100%;
}

.checkmarkCircle {
  stroke: #10b981;
  stroke-width: 2;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: strokeCircle 0.5s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

@keyframes strokeCircle {
  100% {
    stroke-dashoffset: 0;
  }
}

.checkmarkCheck {
  stroke: #10b981;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: strokeCheck 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
}

@keyframes strokeCheck {
  100% {
    stroke-dashoffset: 0;
  }
}

.successTitle {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.4s ease 0.3s both;
}

.successSubtitle {
  margin: 0;
  font-size: 15px;
  color: #6b7280;
  animation: fadeInUp 0.4s ease 0.4s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================================ */
/* SUMMARY CARD */
/* ============================================ */

.summaryCard {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.5s ease 0.5s both;
}

.summaryHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.summaryTitle {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.statusBadge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: white;
}

/* ============================================ */
/* STATS GRID */
/* ============================================ */

.statsGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.statItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--background-secondary, #f8f9fa);
  border-radius: 12px;
}

.statIcon {
  font-size: 28px;
  line-height: 1;
}

.statContent {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.statValue {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary, #1f2937);
}

.statLabel {
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
}

/* ============================================ */
/* BREAKDOWN */
/* ============================================ */

.breakdown {
  padding: 20px;
  background: var(--background-secondary, #f8f9fa);
  border-radius: 12px;
  margin-bottom: 24px;
}

.breakdownTitle {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.breakdownBars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.breakdownBar {
  display: grid;
  grid-template-columns: 50px 1fr 40px;
  align-items: center;
  gap: 12px;
}

.breakdownLabel {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary, #6b7280);
}

.breakdownProgress {
  height: 8px;
  background: var(--border-color, #e5e7eb);
  border-radius: 4px;
  overflow: hidden;
}

.breakdownFill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.breakdownCount {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
  text-align: right;
}

/* ============================================ */
/* INFO */
/* ============================================ */

.info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color, #e5e7eb);
}

.infoRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.infoLabel {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
}

.infoValue {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

/* ============================================ */
/* ACTIONS */
/* ============================================ */

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  animation: fadeInUp 0.5s ease 0.6s both;
}

.btnPrimary,
.btnSecondary {
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btnPrimary {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btnPrimary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.btnSecondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btnSecondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* ============================================ */
/* QUICK ACTIONS */
/* ============================================ */

.quickActions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  animation: fadeInUp 0.5s ease 0.7s both;
}

.quickAction {
  padding: 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quickAction:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.quickAction:active {
  transform: translateY(0);
}

/* ============================================ */
/* PRINT STYLES (for PDF export) */
/* ============================================ */

@media print {
  .container {
    background: white;
    padding: 20px;
  }

  .successAnimation {
    display: none;
  }

  .actions,
  .quickActions {
    display: none;
  }

  .summaryCard {
    box-shadow: none;
    border: 1px solid #e5e7eb;
    page-break-inside: avoid;
  }

  .statsGrid,
  .breakdown,
  .info {
    page-break-inside: avoid;
  }
}

/* ============================================ */
/* LOADING & ERROR */
/* ============================================ */

.loadingContainer,
.errorContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 16px;
  padding: 20px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.loadingSpinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.errorIcon {
  font-size: 64px;
}

.errorContainer h2 {
  margin: 0;
  font-size: 24px;
}

.errorContainer .btnPrimary {
  margin-top: 16px;
  background: white;
  color: #667eea;
}

/* ============================================ */
/* RESPONSIVE */
/* ============================================ */

@media (max-width: 640px) {
  .container {
    padding: 16px;
    padding-bottom: 80px;
  }

  .successTitle {
    font-size: 24px;
  }

  .successSubtitle {
    font-size: 14px;
  }

  .summaryCard {
    padding: 20px;
  }

  .statsGrid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .actions {
    grid-template-columns: 1fr;
  }

  .quickActions {
    grid-template-columns: 1fr;
  }
}