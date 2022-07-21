import { clientErrorResponse, successResponse } from "@libs/api-gateway";

const axios = require("axios");

const fibonacci = async (event) => {
  const querystring = event.queryStringParameters;
  if (querystring === null) {
    return clientErrorResponse({
      body: 'Please enter a number in the end of url "?input=<number>"',
    });
  }

  const input = querystring.input;

  if (isNaN(input)) {
    return clientErrorResponse({
      errorMessage: "Please enter a number",
    });
  }

  if (input < 1 || input > 150) {
    return clientErrorResponse({
      input: input,
      factorial: "error(The value should be less than 100)",
      fibonacci: "error(The value should be less than 150)",
    });
  }

  // Fibonacci calcualtion

  const fib = (n: number) => {
    if (n <= 1) {
      return n;
    }
    const result = [0, 1];
    for (let i = 2; i <= n; i++) {
      result[i] = result[i - 2] + result[i - 1];
    }

    return result[result.length - 1];
  };

  const fboNum = fib(input);

  try {
    const res = await axios.get(
      "https://jvg6617co1.execute-api.us-east-1.amazonaws.com/dev/factorial",
      {
        params: {
          input: input,
        },
      }
    );

    return successResponse({
      input: input,
      factorial: res.data["factorial"],
      fibbonaci: fboNum,
    });
  } catch (error) {
    if (error.response["status"] === 400) {
      return successResponse({
        input: input,
        factorial: "error(The value should be less than 100)",
        fibonacci: fboNum,
      });
    } else {
      return successResponse({
        input: input,
        factorial: "The factorial API is down",
        fibonacci: fboNum,
      });
    }
  }
};

export const main = fibonacci;
