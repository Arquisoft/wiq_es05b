
function getQuestionMock() {
    const questions = [];

    questions.push({
        question: 'What is the capital of Spain?',
        options: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia'],
        answer: 0
    });

    questions.push({
        question: 'What is the largest ocean in the world?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        answer: 3
    });
    
    questions.push({
        question: 'Who wrote "Romeo and Juliet"?',
        options: ['William Shakespeare', 'Jane Austen', 'Charles Dickens', 'Mark Twain'],
        answer: 0
    });
    
    questions.push({
        question: 'Which planet is known as the "Red Planet"?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        answer: 1
    });
    
    questions.push({
        question: 'Who painted the Mona Lisa?',
        options: ['Leonardo da Vinci', 'Vincent van Gogh', 'Pablo Picasso', 'Michelangelo'],
        answer: 0
    });
    
    questions.push({
        question: 'What is the chemical symbol for water?',
        options: ['W', 'O', 'H2O', 'H'],
        answer: 3
    });
    
    questions.push({
        question: 'Who was the first man to step on the moon?',
        options: ['Neil Armstrong', 'Buzz Aldrin', 'Michael Collins', 'Yuri Gagarin'],
        answer: 0
    });
    
    questions.push({
        question: 'Which country is famous for its tulips?',
        options: ['Italy', 'Netherlands', 'France', 'Germany'],
        answer: 1
    });
    
    questions.push({
        question: 'What is the currency of Japan?',
        options: ['Yuan', 'Euro', 'Dollar', 'Yen'],
        answer: 3
    });
    
    questions.push({
        question: 'Who wrote "To Kill a Mockingbird"?',
        options: ['Harper Lee', 'J.K. Rowling', 'Stephen King', 'Ernest Hemingway'],
        answer: 0
    });
    
    questions.push({
        question: 'Which continent is the largest by land area?',
        options: ['Africa', 'Europe', 'Asia', 'North America'],
        answer: 2
    });
    
    questions.push({
        question: 'What is the tallest mammal on Earth?',
        options: ['Elephant', 'Giraffe', 'Hippopotamus', 'Rhinoceros'],
        answer: 1
    });
    
    questions.push({
        question: 'Who wrote "The Great Gatsby"?',
        options: ['F. Scott Fitzgerald', 'J.D. Salinger', 'John Steinbeck', 'Herman Melville'],
        answer: 0
    });
    
    questions.push({
        question: 'Which gas do plants absorb from the atmosphere?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
        answer: 2
    });
    
    questions.push({
        question: 'What is the main ingredient in guacamole?',
        options: ['Tomato', 'Onion', 'Avocado', 'Lime'],
        answer: 2
    });
    
    questions.push({
        question: 'Who painted "Starry Night"?',
        options: ['Vincent van Gogh', 'Pablo Picasso', 'Claude Monet', 'Leonardo da Vinci'],
        answer: 0
    });
    
    questions.push({
        question: 'What is the chemical symbol for gold?',
        options: ['Au', 'Ag', 'Fe', 'Cu'],
        answer: 0
    });
    
    questions.push({
        question: 'Which city is known as the "Big Apple"?',
        options: ['Los Angeles', 'Chicago', 'New York City', 'Miami'],
        answer: 2
    });
    
    questions.push({
        question: 'Who invented the telephone?',
        options: ['Alexander Graham Bell', 'Thomas Edison', 'Nikola Tesla', 'Guglielmo Marconi'],
        answer: 0
    });
    
    questions.push({
        question: 'What is the largest organ in the human body?',
        options: ['Brain', 'Liver', 'Skin', 'Heart'],
        answer: 2
    });
    
    questions.push({
        question: 'Who painted the ceiling of the Sistine Chapel?',
        options: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello'],
        answer: 1
    });

    return questions;
}


module.exports = {getQuestionMock};