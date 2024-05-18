import realAxios from "axios";

const axios = realAxios.create({
  baseURL: "http://localhost:3000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export { axios };
