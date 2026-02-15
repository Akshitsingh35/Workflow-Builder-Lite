How I Used AI During This Project

I used AI tools to speed up development, but not to make architectural decisions for me.

Before writing code, I designed the overall system flow myself — including how workflows are stored, how steps are executed sequentially, how LLM calls are isolated, and how errors propagate through the system.

AI helped with implementation efficiency, but I made sure I understood and verified every part of the codebase.

AI Tools Used
GitHub Copilot (Claude)

Used mainly for:

Generating boilerplate Express routes

Writing repetitive CRUD logic

Suggesting small refactors

Improving documentation clarity

Every AI-generated snippet was:

Reviewed

Tested manually

Adjusted to match my architecture

Refactored when necessary

I did not copy large blocks blindly. I made sure I understood what each part of the code was doing.

LLM Provider Used in the App
Google Gemini (gemini-2.5-flash)

Gemini is used inside the application to execute workflow steps like:

Summarization

Key point extraction

Sentiment analysis

Tag generation

Title generation

Why I Chose Gemini

The choice was intentional:

It has a generous free tier (important for hosted demo projects).

The Flash model is fast, which keeps multi-step workflows responsive.

It provides solid quality for text-processing tasks.

The official SDK integrates cleanly into Node.js.

I also designed the system so that the LLM provider can be replaced easily in the future.

What I Designed Manually

The following were designed and verified by me:

The step registry pattern (each step defines its behavior and LLM usage)

Sequential workflow execution logic

Passing output of one step into the next

Centralized error handling with operational vs unknown errors

Validation rules (2–4 steps required, valid step types only)

Health check endpoint (database + LLM connectivity)

Separation of controllers, services, and routes

Prisma schema relationships

I tested all endpoints manually using Postman and through the frontend.

Prompt Design

Each LLM-based step defines its own prompt template inside the Step Registry.

This gives:

Clear responsibility per step

Predictable outputs

Easy extensibility

Controlled LLM behavior

I tested prompts with multiple input variations to ensure consistent output quality.

Code Quality Decisions

No API keys are hardcoded.

All configuration is environment-based.

Async route handlers are wrapped to avoid unhandled promise rejections.

Validation happens before database or LLM execution.

Controllers are kept thin and delegate logic to services.

Future Improvements (If Extended Further)

If this were extended into a production system, I would add:

Support for multiple LLM providers

Model selection per workflow step

Streaming responses

Token usage tracking

Response caching

User-defined custom step prompts

Final Note

AI helped me move faster while building this project, but I made sure to fully understand and verify the system’s architecture, execution flow, and integration details.

My approach to AI-assisted development is simple:

Use AI to accelerate — but always stay in control of the design.