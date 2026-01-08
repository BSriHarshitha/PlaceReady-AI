# Real API Setup for Presentation

## Quick Setup (5 minutes):

### 1. OpenAI API (Most Important - for real resume analysis)
1. Go to https://platform.openai.com/api-keys
2. Create account and get API key
3. Copy `.env.example` to `.env` in frontend folder
4. Add your OpenAI API key: `REACT_APP_OPENAI_API_KEY=sk-your-key-here`

### 2. Real Coding Profiles (Already Working)
- ✅ **LeetCode**: Uses public GraphQL API (no key needed)
- ✅ **GitHub**: Uses public REST API (no key needed)  
- ✅ **Codeforces**: Uses public API (no key needed)
- ✅ **CodeChef**: Simulated (no public API available)

### 3. Test with Real Data
1. Upload an actual resume PDF
2. Enter real usernames:
   - LeetCode: Any valid LeetCode username
   - GitHub: Any valid GitHub username
   - Codeforces: Any valid Codeforces handle

## What You Get:
- ✅ **Real AI resume analysis** using OpenAI GPT
- ✅ **Real coding statistics** from LeetCode, GitHub, Codeforces
- ✅ **Actual skill extraction** from resume text
- ✅ **Dynamic scoring** based on real data
- ✅ **Professional presentation-ready** results

## Fallback:
If APIs fail during presentation, system automatically falls back to realistic mock data - no interruption!

## Cost:
- OpenAI: ~$0.01-0.05 per resume analysis
- Other APIs: Free

## Demo Usernames (for testing):
- LeetCode: `leetcode` or `errichto`
- GitHub: `torvalds` or `gaearon`
- Codeforces: `tourist` or `Petr`