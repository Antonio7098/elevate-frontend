Task Summary: Advanced Chat Controls & Context
Feature Goal:
To implement a set of user-configurable "Chat Options" that allow a user to define the AI's behavior, personality, and knowledge scope for a specific chat session. This moves beyond static user preferences and gives them dynamic, on-the-fly control over their AI co-pilot.

Core Components of the Feature:

Tone Control (The AI's Personality):

The user can select a tone for the AI's responses throughout the conversation.
Options: Formal, Socratic, Passionate, Encouraging, etc.
Purpose Control (The AI's Role):

The user can set the primary goal for the chat session, which dictates the AI's function.
Options:
Learn: AI acts as a teacher for new topics.
Revise: AI quizzes the user with active recall questions.
Remember: AI focuses on generating "Insight Catalysts" (mnemonics, analogies).
Explore: AI helps connect ideas to broader contexts.
Debate: AI acts as a "devil's advocate" to challenge the user's understanding.
Context Scope Control (The AI's Knowledge Base):

The user can define the boundaries of the information the AI should use for its answers.
Options: This Note Only, This Folder, All My Content, + External Knowledge.
Special Instructions (Power User Feature):

A simple text input where a user can provide free-form instructions for the session (e.g., "Explain this to me like I'm 10 years old").
High-Level Implementation Plan:

Frontend:
Design and build a UI component (e.g., a "Chat Options" popover or panel) that allows the user to select these settings before or during a chat.
When sending a message to the backend, include these selected options in the API request payload.
Backend (Core API):
The POST /api/ai/chat endpoint must be updated to accept these new options (tone, purpose, scope, specialInstructions) in its request body.
This data must be passed along in the call to the Python AI Service.
Backend (Python AI Service):
The create_chat_prompt function needs a major refactor. It will now dynamically construct a detailed system prompt for Gemini based on the received options, instructing it on how to behave for the entire conversation.