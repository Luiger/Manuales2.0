const API_URL = 'https://c16f1fe83b2d.ngrok-free.app/api/form';

const getFormQuestions = async () => {
  try {
    const response = await fetch(`${API_URL}/questions`);
    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error('Error fetching form questions:', error);
    return null;
  }
};

const submitFormAnswers = async (answers) => {
  try {
    const response = await fetch(`${API_URL}/answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error submitting form answers:', errorData);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error submitting form answers:', error);
    return false;
  }
};

export {
  getFormQuestions,
  submitFormAnswers,
};
