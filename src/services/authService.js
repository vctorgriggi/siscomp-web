import { index } from "./index";

const serviceUrl = "/auth";

/* sign in, sign up, sign out */
export async function signIn(dto) {
  try {
    const response = await index.post(`${serviceUrl}/sign-in`, dto);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An error occurred while processing your request.");
    }
  }
}

export async function signUp(dto) {
  try {
    const response = await index.post(`${serviceUrl}/sign-up`, dto);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An error occurred while processing your request.");
    }
  }
}

export async function signOut() {
  try {
    await index.post(`${serviceUrl}/sign-out`);
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An error occurred while processing your request.");
    }
  }
}

/* reset password */
export async function forgotPassword(dto) {
  try {
    await index.post(`${serviceUrl}/forgot-password`, dto);
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An error occurred while processing your request.");
    }
  }
}

export async function resetPassword(id, token, dto) {
  try {
    await index.post(`${serviceUrl}/reset-password/${id}/${token}`, dto);
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An error occurred while processing your request.");
    }
  }
}

/* validate token */
export async function validateUserToken() {
  try {
    const response = await index.get(`${serviceUrl}/validate-user-token`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An error occurred while processing your request.");
    }
  }
}

export async function validateResetToken(id, token) {
  try {
    await index.get(`${serviceUrl}/validate-reset-token/${id}/${token}`);
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An error occurred while processing your request.");
    }
  }
}
