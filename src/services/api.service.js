const API_URL = process.env.API_URL;

const getFormQuestions = async () => {
  try {
    const response = await fetch(`${API_URL}/questions`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error fetching form questions' }));
      return { success: false, error: errorData };
    }
    const data = await response.json();
    return { success: true, questions: data.questions };
  } catch (error) {
    console.error('Error fetching form questions:', error);
    return { success: false, error: { message: error.message } };
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
      const errorData = await response.json().catch(() => ({ message: 'Error submitting form answers' }));
      console.error('Error submitting form answers:', errorData);
      return { success: false, error: errorData };
    }
    return { success: true };
  } catch (error) {
    console.error('Error submitting form answers:', error);
    return { success: false, error: { message: error.message } };
  }
};

export {
  getFormQuestions,
  submitFormAnswers,
};
