import request from "../utils/request";

export function query() {
  return request("https://api.apiopen.top/getJoke");
}
