# Quiz JSON Schema

Each quiz is stored as a JSON file in the `data/` directory. The filename (without `.json`) becomes the quiz ID.

## Schema Structure

```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "settings": {
    "showFeedback": "immediate | end",
    "randomizeQuestions": boolean,
    "questionBankSize": number | null,
    "passingScore": number (0-100, optional)
  },
  "questions": [
    {
      "id": "string (required, unique within quiz)",
      "type": "single | multiple",
      "question": "string (required)",
      "options": [
        {
          "id": "string (required, unique within question)",
          "text": "string (required)"
        }
      ],
      "correctAnswers": ["string (option id)"],
      "score": number (required, points for this question),
      "randomizeOptions": boolean (optional, default false),
      "feedback": {
        "correct": "string (required)",
        "incorrect": "string (required)"
      }
    }
  ]
}
```

## Field Descriptions

### Root Level

- **title**: The display name of the quiz
- **description**: Optional description shown before starting the quiz
- **settings**: Configuration for quiz behavior

### Settings

- **showFeedback**: When to show answer feedback
  - `"immediate"`: Show feedback after each question
  - `"end"`: Show all feedback after quiz completion
- **randomizeQuestions**: If true, questions appear in random order each attempt
- **questionBankSize**: If set, only this many questions are shown per attempt (randomly selected from all questions). If null or omitted, all questions are shown
- **passingScore**: Optional percentage (0-100) needed to pass

### Questions

- **id**: Unique identifier for the question within this quiz
- **type**: Question type
  - `"single"`: Multiple choice, one correct answer
  - `"multiple"`: Multiple select, one or more correct answers
- **question**: The question text
- **options**: Array of possible answers
- **correctAnswers**: Array of option IDs that are correct
- **score**: Point value for this question
- **randomizeOptions**: If true, options appear in random order
- **feedback**: Messages shown based on answer correctness

## Scoring Rules

### Single Choice
- Correct answer: full score
- Incorrect answer: 0 points

### Multiple Choice
Partial credit is awarded based on correct and incorrect selections:

- Formula: `(correct_selected / total_correct) - (incorrect_selected / total_incorrect)`
- Minimum score: 0 (never negative)

Examples for a 1-point question with 3 correct answers:
- Select 2/3 correct, 0 wrong: 2/3 = 0.67 points
- Select 2/3 correct, 1 wrong: (2/3) - (1/2) = 0.17 points
- Select 3/3 correct, 0 wrong: 1.0 points
- Select 3/3 correct, 1 wrong: (3/3) - (1/2) = 0.5 points

## Example Quiz

```json
{
  "title": "JavaScript Fundamentals",
  "description": "Test your knowledge of JavaScript basics",
  "settings": {
    "showFeedback": "immediate",
    "randomizeQuestions": true,
    "questionBankSize": 5,
    "passingScore": 70
  },
  "questions": [
    {
      "id": "q1",
      "type": "single",
      "question": "What is the result of typeof null?",
      "options": [
        {"id": "a", "text": "\"null\""},
        {"id": "b", "text": "\"object\""},
        {"id": "c", "text": "\"undefined\""},
        {"id": "d", "text": "\"boolean\""}
      ],
      "correctAnswers": ["b"],
      "score": 1,
      "randomizeOptions": false,
      "feedback": {
        "correct": "Correct! This is a well-known JavaScript quirk.",
        "incorrect": "Not quite. typeof null returns \"object\" due to a legacy bug in JavaScript."
      }
    },
    {
      "id": "q2",
      "type": "multiple",
      "question": "Which of these are valid JavaScript data types?",
      "options": [
        {"id": "a", "text": "String"},
        {"id": "b", "text": "Integer"},
        {"id": "c", "text": "Boolean"},
        {"id": "d", "text": "Symbol"},
        {"id": "e", "text": "Float"}
      ],
      "correctAnswers": ["a", "c", "d"],
      "score": 2,
      "randomizeOptions": true,
      "feedback": {
        "correct": "Excellent! JavaScript has String, Boolean, and Symbol as primitive types.",
        "incorrect": "JavaScript doesn't have separate Integer or Float types - it uses Number for all numeric values."
      }
    }
  ]
}
```

## Notes

- All quiz files must be valid JSON
- Question and option IDs must be unique within their scope
- At least one correct answer must be specified
- For single choice questions, exactly one correct answer should be specified
- Score values should be positive numbers
- File watching automatically detects new/removed quiz files
