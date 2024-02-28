let api = "http://localhost:3000/api";

let token = localStorage.getItem("token");

const headers = new Headers();
headers.set("Authorization", token);
headers.set("Content-Type", "application/json");

export async function addNewUser(userData) {
  const response = await fetch(`${api}/v1/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const responseData = await response.json();

  console.log("Uspjesna registracija");

  if (!response.ok) {
    throw new Error("Failed to add new staff");
  }

  return responseData;
}

export async function loginUser(userData) {
  const response = await fetch(`${api}/v1/users/login`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(userData),
  });

  const responseData = await response.json();

  console.log("Uspjesna prijava");

  if (!response.ok) {
    throw new Error("Failed to add new staff");
  }

  return responseData;
}

export async function addTask(data) {
  const response = await fetch(`${api}/v1/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error("Failed to add new task");
  }
  return responseData;
}

export const getAllTasks = () => {
  return fetch(`${api}/v1/tasks`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
      return [];
    });
};

export const getAllTasksInRadius = (distance, latlng) => {
  return fetch(
    `${api}/v1/tasks/within/${distance}/center/${latlng}
  `,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
      return [];
    });
};

export const getTaskById = (taskId) => {
  return fetch(`${api}/v1/tasks/${taskId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .catch((error) => {
      console.error(`Error fetching task ${taskId}:`, error);
      return [];
    });
};

export async function getLoggedUser() {
  const response = await fetch(`${api}/v1/users/current`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // const cookies = response.headers.get("set-cookie");
  // // Set the cookie in the browser's cookie storage
  // document.cookie = cookies;

  const responseData = await response.json();

  console.log("Uspjesna dobivanja usera");

  if (!response.ok) {
    throw new Error("Failed to get logged user");
  }

  return responseData;
}

export async function editLoggedUser(userData) {
  const formData = new FormData();

  for (const key in userData) {
    formData.append(key, userData[key]);
  }

  const response = await fetch(`${api}/v1/users/current`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const responseData = await response.json();

  console.log("Successful user edit");

  if (!response.ok) {
    throw new Error("Failed to edit logged user");
  }

  return responseData;
}

export async function deleteLoggedUser() {
  const response = await fetch(`${api}/v1/users/current`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  console.log("Uspjesna dobivanja usera");

  if (!response.ok) {
    throw new Error("Failed to get logged user");
  }

  return responseData;
}

export const getHistoryTasks = () => {
  return fetch(`${api}/v1/users/current/task-history`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
      return [];
    });
};

export async function acceptJob(id) {
  const response = await fetch(`${api}/v1/tasks/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  console.log("Uspjesno prihvacanje posla");

  if (!response.ok) {
    throw new Error("Failed to join job");
  }

  return responseData;
}
