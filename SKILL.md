---
name: create-quiz
description: Create a new quiz JSON file with proper schema validation
---

# Create Quiz Skill

This skill helps you create properly formatted quiz JSON files for the quiz webapp.

## Process

1. **Understand the topic**: Ask the user what subject/topic the quiz should cover
2. **Determine scope**: Ask how many questions they want
3. **Configure settings**: Ask about:
   - Feedback timing (immediate or end)
   - Question randomization
   - Question bank (show all questions or sample X per attempt)
   - Passing score threshold

4. **Create questions**: For each question:
   - Write clear, unambiguous question text
   - Provide 3-5 options for single choice, 4-7 for multiple choice
   - Mark correct answer(s)
   - Assign appropriate point value
   - Write helpful feedback for both correct and incorrect answers
   - Consider if options should be randomized

5. **Validate structure**: Ensure the JSON follows the schema in `SCHEMA.md`
6. **Save file**: Save to `data/{quiz-id}.json` where quiz-id is a kebab-case identifier

## Schema Reference

Read `SCHEMA.md` for complete details. Key points:

- **Question types**: `"single"` (one answer) or `"multiple"` (one or more answers)
- **Feedback timing**: `"immediate"` or `"end"`
- **Question bank**: Set `questionBankSize` to limit questions per attempt
- **Scoring**: Each question has a `score` field; multiple choice awards partial credit

## Quality Guidelines

### Writing Good Questions

- Be specific and unambiguous
- Avoid "all of the above" or "none of the above"
- Don't use trick questions unless that's the learning goal
- Make distractors plausible but clearly wrong to someone who knows the material

### Writing Good Feedback

- **Correct feedback**: Reinforce why the answer is right, add context
- **Incorrect feedback**: Explain the correct answer and why, help learning
- Keep feedback concise but informative

### Difficulty Balance

- Mix easier and harder questions
- Use point values to weight harder questions
- Consider question bank mode for longer quizzes

## Example Usage

**User**: Create a quiz about Python basics with 10 questions

**Agent**: I'll create a Python basics quiz. Let me gather some details:

1. Should feedback be shown immediately after each question, or at the end?
2. Should questions appear in random order each attempt?
3. Do you want all 10 questions shown each time, or use a question bank (e.g., show 5 random questions per attempt)?
4. What percentage should be required to pass (if any)?

**User**: Show feedback immediately, randomize questions, show all questions, 70% to pass

**Agent**: Perfect. I'll create a quiz covering Python fundamentals with 10 questions. *[Creates data/python-basics.json with varied question types and difficulty levels]*

## Tips

- Use `"single"` type for most questions; save `"multiple"` for when multiple answers truly apply
- Weight harder questions with higher scores (2-3 points vs 1 point for easier ones)
- Make incorrect feedback educational, not just "wrong"
- For technical quizzes, include code examples in question text when relevant
- Test the quiz yourself after creating it
