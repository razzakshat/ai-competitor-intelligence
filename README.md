# \# AI Competitor Intelligence System

# 

# An automated competitor monitoring system powered by multi-agent AI. 

# Add competitors, and the system automatically scrapes their websites daily, 

# detects changes, generates strategic briefings, and sends Slack alerts.

# 

# \## 🔴 Live Demo

# \- \*\*Dashboard:\*\* https://ai-competitor-intelligence-frontend.vercel.app

# \- \*\*API:\*\* https://backend-production-2cb7.up.railway.app/health

# 

# \## 🏗️ Architecture

# User → React Dashboard → Express API → LangGraph Workflow

# ↓

# ┌─────────────────┐

# │  Scraper Agent  │

# │  (Axios+Cheerio)│

# └────────┬────────┘

# ↓

# ┌─────────────────┐

# │    ChromaDB     │

# │ Vector Storage  │

# └────────┬────────┘

# ↓

# ┌─────────────────┐

# │ Analyzer Agent  │

# │  (RAG-powered)  │

# └────────┬────────┘

# ↓

# ┌─────────────────┐

# │Strategist Agent │

# │  (Briefings)    │

# └────────┬────────┘

# ↓

# Slack Alert + MongoDB

# 

# \## ⚡ Features

# 

# \- \*\*Automated Web Scraping\*\* — Visits competitor websites using Axios and Cheerio

# \- \*\*AI Intelligence Extraction\*\* — Groq LLM extracts structured competitive intelligence

# \- \*\*Vector Memory\*\* — ChromaDB stores embeddings for semantic search

# \- \*\*Change Detection\*\* — MD5 content hashing detects website changes

# \- \*\*RAG Pipeline\*\* — Retrieves historical context for smarter analysis

# \- \*\*Multi-Agent Workflow\*\* — LangGraph orchestrates 3 specialized AI agents

# \- \*\*Strategic Briefings\*\* — AI generates actionable business recommendations

# \- \*\*Slack Alerts\*\* — Real-time notifications for significant competitor changes

# \- \*\*React Dashboard\*\* — Full UI for managing competitors and viewing briefings

# 

# \## 🛠️ Tech Stack

# 

# \### Backend

# \- Node.js + Express.js + TypeScript

# \- MongoDB (structured storage)

# \- ChromaDB (vector database)

# \- LangChain.js + LangGraph (agent orchestration)

# \- Groq LLM (llama-3.3-70b)

# \- HuggingFace Embeddings

# \- Slack Bolt SDK

# 

# \### Frontend

# \- Next.js 15 + React + TypeScript

# \- Tailwind CSS + shadcn/ui

# 

# \### Infrastructure

# \- Railway (backend + MongoDB)

# \- Vercel (frontend)

# \- Docker (local development)

# 

# \## 🤖 Agent Architecture

# 

# \### Scraper Agent

# Visits competitor websites, strips HTML noise using Cheerio,

# and uses Groq AI to extract structured JSON intelligence.

# 

# \### Analyzer Agent

# Retrieves historical data from ChromaDB using semantic search,

# compares with new intelligence, and detects significant changes.

# 

# \### Strategist Agent

# Uses RAG to pull market context and generates actionable

# business briefings with specific recommendations.

# 

# \## 🚀 Getting Started

# 

# \### Prerequisites

# \- Node.js 18+

# \- Docker Desktop

# \- Groq API Key (free at console.groq.com)

# \- HuggingFace API Key (free at huggingface.co)

# \- Slack Bot Token

# 

# \### Installation

# 

# ```bash

# \# Clone the repository

# git clone https://github.com/YOUR\_USERNAME/ai-competitor-intelligence.git

# 

# \# Install backend dependencies

# cd backend

# npm install

# 

# \# Set up environment variables

# cp .env.example .env

# \# Fill in your API keys

# 

# \# Start Docker services

# docker run -d -p 27017:27017 --name mongodb mongo:7

# docker run -d -p 8000:8000 --name chromadb chromadb/chroma:latest

# 

# \# Start backend

# npm run dev

# 

# \# Install and start frontend

# cd ../frontend

# npm install

# npm run dev

# ```

# 

# \### Environment Variables

# 

# ```env

# GROQ\_API\_KEY=

# HUGGINGFACE\_API\_KEY=

# MONGODB\_URI=

# CHROMA\_URL=http://localhost:8000

# SLACK\_BOT\_TOKEN=

# SLACK\_SIGNING\_SECRET=

# SLACK\_CHANNEL\_ID=

# ```

# 

# \## 📊 How It Works

# 

# 1\. User adds a competitor with their website URL

# 2\. System scrapes the website using Axios + Cheerio

# 3\. Groq AI extracts structured intelligence (features, pricing, updates)

# 4\. Intelligence is embedded using HuggingFace and stored in ChromaDB

# 5\. Analyzer agent retrieves historical context via semantic search

# 6\. Compares new vs historical data to detect significant changes

# 7\. If changes detected → Strategist generates business briefing

# 8\. Briefing saved to MongoDB + Slack alert sent to team

# 9\. Dashboard displays all competitors and briefings

# 

# \## 🔑 Key Engineering Decisions

# 

# \*\*Why two databases?\*\*

# MongoDB handles structured queries (find all active competitors).

# ChromaDB handles semantic search (find intelligence about pricing strategies).

# They solve fundamentally different problems.

# 

# \*\*Why LangGraph?\*\*

# Conditional routing saves compute — if no significant changes detected,

# the expensive strategist agent never runs.

# 

# \*\*Why RAG?\*\*

# Without RAG, the AI only knows its training data.

# With RAG, it has access to your private, current competitor data.

# 

# \## 📝 License

# MIT

