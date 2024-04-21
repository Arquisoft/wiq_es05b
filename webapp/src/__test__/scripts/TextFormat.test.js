const textFormat = require('../../scripts/textFormat');

describe('textFormat function', () => {
    test('converts camel case to title case', () => {
        const input = 'camelCaseExample';
        const expectedOutput = 'Camel case example';
        const result = textFormat(input);
        expect(result).toEqual(expectedOutput);
    });

    test('converts snake case to title case', () => {
        const input = 'snake_case';
        const expectedOutput = 'Snake case';
        const result = textFormat(input);
        expect(result).toEqual(expectedOutput);
    });

    test('converts mixed case to title case', () => {
        const input = 'Mixed_CamelCase snake_caseExample';
        const expectedOutput = 'Mixed camel case snake_case example';
        const result = textFormat(input);
        expect(result).toEqual(expectedOutput);
    });

    test('handles single word input', () => {
        const input = 'hello';
        const expectedOutput = 'Hello';
        const result = textFormat(input);
        expect(result).toEqual(expectedOutput);
    });

    test('handles empty input', () => {
        const input = '';
        const expectedOutput = '';
        const result = textFormat(input);
        expect(result).toEqual(expectedOutput);
    });
});
