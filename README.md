# Quiz Platform

A dynamic, filesystem-based quiz application with local browser storage for attempt history. Add or remove quiz files and see changes reflected immediately on the site.
> [!IMPORTANT]
> **AI Disclaimer:** This is an AI-generated project only meant for personal use. You are welcome to contribute by creating PRs, but this project is strictly a **hobby/side project**.

## Features

- **Dynamic quiz loading**: Quizzes automatically appear/disappear based on JSON files in the `data/` directory
- **Multiple question types**: Single-choice and multiple-choice with partial credit scoring
- **Flexible feedback**: Show feedback immediately after each question or at the end
- **Question bank mode**: Show a random subset of questions per attempt
- **Randomization**: Randomize question order and/or option order
- **Local storage**: All attempt history stays in the browser, no server-side data
- **Data management**: Users control their data with granular delete options
- **Responsive design**: Works on desktop and mobile

## Getting Started

### Installation

```bash
npm install
npm start
```

The server runs at `http://localhost:3000`

### Creating Quizzes

Add JSON files to the `data/` directory. See `SCHEMA.md` for the complete format.

Quick example:

```json
{
  "title": "My Quiz",
  "description": "Optional description",
  "settings": {
    "showFeedback": "immediate",
    "randomizeQuestions": false,
    "questionBankSize": null,
    "passingScore": 70
  },
  "questions": [
    {
      "id": "q1",
      "type": "single",
      "question": "What is 2 + 2?",
      "options": [
        {"id": "a", "text": "3"},
        {"id": "b", "text": "4"},
        {"id": "c", "text": "5"}
      ],
      "correctAnswers": ["b"],
      "score": 1,
      "randomizeOptions": false,
      "feedback": {
        "correct": "Correct! 2 + 2 = 4",
        "incorrect": "Not quite. 2 + 2 = 4"
      }
    }
  ]
}
```

## Quiz Schema

See `SCHEMA.md` for complete documentation.

### Key Settings

- **showFeedback**: `"immediate"` or `"end"`
- **randomizeQuestions**: Shuffle question order each attempt
- **questionBankSize**: Show only X random questions per attempt (null = show all)
- **passingScore**: Percentage needed to pass (optional)

### Question Types

**Single choice** (`"type": "single"`):
- One correct answer
- Full points for correct, zero for incorrect

**Multiple choice** (`"type": "multiple"`):
- One or more correct answers
- Partial credit awarded proportionally
- Formula: `(correct_selected / total_correct) - (incorrect_selected / total_incorrect)`

### Scoring Example

For a multiple-choice question worth 1 point with 3 correct answers:
- Select 2/3 correct, 0 wrong: 0.67 points
- Select 2/3 correct, 1 wrong: 0.17 points  
- Select 3/3 correct, 0 wrong: 1.0 points
- Select 3/3 correct, 1 wrong: 0.5 points

## Creating Quizzes with AI

Use the `/create-quiz` skill to have an AI agent create properly formatted quiz files:

```
/create-quiz Create a 10-question quiz about JavaScript promises
```

The skill will guide you through configuration and generate a valid JSON file.

## Data Storage

All quiz attempts are stored in the browser's localStorage under the key `quiz_platform_data`. The structure:

```json
{
  "attempts": {
    "quiz-id": [
      {
        "timestamp": "2026-09-27T12:00:00.000Z",
        "score": 8.5,
        "maxScore": 10,
        "percentage": 85,
        "passed": true
      }
    ]
  }
}
```

### Data Management

Users can:
- View all attempt history in Settings
- Delete data for a specific quiz
- Delete all data at once

When a quiz file is removed, its attempt data is automatically cleaned up.

## File Watching

The app uses Server-Sent Events (SSE) for real-time updates. When quiz files are added or removed:
- Server pushes updates instantly to all connected clients
- Quiz list updates automatically
- Orphaned attempt data is cleaned up
- No page reload required

The server watches the `data/` directory and notifies clients immediately when changes occur.

## Design

The interface follows these principles:
- **Distinctive**: Navy ink and amber accents, avoiding generic template patterns
- **Minimal**: Information-dense without decoration
- **Functional**: Every visual element serves the content
- **Accessible**: Keyboard navigation, visible focus states, clear hierarchy

## Project Structure

```
quiz/
├── data/                          # Quiz JSON files
│   └── javascript-fundamentals.json
├── .claude/
│   └── skills/
│       └── create-quiz.md        # AI skill for creating quizzes
├── index.html                     # Single-page webapp
├── server.js                      # Express server
├── package.json
├── SCHEMA.md                      # Quiz JSON schema documentation
└── README.md
```

## Browser Compatibility

Works in all modern browsers with:
- localStorage support
- ES6+ JavaScript
- CSS Grid and Flexbox

## License

MIT
