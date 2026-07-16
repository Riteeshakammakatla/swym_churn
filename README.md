# Merchant Churn Risk Dashboard

A modern React dashboard that helps Customer Success teams proactively identify merchants at risk of churning using an explainable heuristic risk engine.

Built as part of an AI Proficiency Build Round to demonstrate product thinking, requirement clarification, explainable decision-making, and frontend engineering.

---

## Live Demo

> Add deployment link here

https://merchant-churn-dashboard.onrender.com

## Features

### Explainable Churn Risk Analysis

Instead of relying on a black-box ML model, this dashboard uses a transparent heuristic scoring engine across four business dimensions:

- Activity Health
- Financial Health
- Technical Health
- Support Health

Each merchant receives:

- Risk Score (0–100)
- Risk Level (Low, Medium, High, Critical)
- Risk Breakdown
- Dominant Risk Factor
- Explainable Reasoning
- Recommended Next Action

---

## Recommendation Engine

The dashboard recommends interventions based on the dominant risk driver rather than only the overall score.

Examples include:

- Executive Business Review
- Integration Audit
- Re-engagement Campaign
- Support Escalation
- Executive Sponsor Outreach

---

## Dashboard Components

- Portfolio KPI Cards
- Merchant Table
- Search & Multi-filter
- Risk Distribution Chart
- Urgent Action Center
- Merchant Detail Drawer
- Explainable Risk Analysis
- Recommendation Panel

---

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- Context API
- LocalStorage
- Recharts

---

## Folder Structure

```text
src/
├── components/
│   ├── common/
│   ├── dashboard/
│   └── detail/
├── context/
├── data/
├── services/
├── types/
├── utils/
└── App.tsx
```

---

## Risk Scoring

Risk is calculated using a weighted heuristic model.

| Dimension | Weight |
|-----------|---------|
| Activity | 30% |
| Financial | 30% |
| Technical | 20% |
| Support | 20% |

The scoring engine also supports:

- Industry-specific thresholds
- Seasonal business mitigation
- Customer Success intervention mitigation

---

## Explainability

Every merchant includes:

- Risk score
- Dominant risk factor
- Dimension-wise breakdown
- Human-readable reasoning
- Recommended intervention

This enables Customer Success Managers to understand *why* a merchant is at risk before taking action.

---

## Data Persistence

Merchant state is stored locally using browser LocalStorage.

Features preserved across reloads include:

- Logged CSM actions
- Merchant notes
- Recent activity

---

## Design System

- Glassmorphism UI
- Dark Theme
- Responsive Layout
- Semantic Risk Colors
- Tailwind CSS v4
- Smooth Drawer Animations

---

## Future Improvements

- Backend API
- Authentication
- Real merchant data
- ML-based churn prediction
- Follow-up reminders
- Bulk playbooks
- Notification system
- Team collaboration
- Export reports
- Role-based access

---

## Installation

Clone the repository

```bash
git clone https://github.com/<username>/<repo>.git
```

Install dependencies

```bash
npm install
```

Run locally

```bash
npm run dev
```

Production build

```bash
npm run build
```

---

## Author

Riteesha Kammakatla
