type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type InputTag = "input" | "textarea";
type Field = InputTag | { [key: string]: Field };
type Fields = Record<string, Field>;

type operation = {
  name: string;
  endpoint: string;
  method: HttpMethod;
  fields: Fields;
};

const operations: operation[] = [
  {
    name: "Get Session User (logged in user)",
    endpoint: "/api/session",
    method: "GET",
    fields: {},
  },
  {
    name: "Create User",
    endpoint: "/api/users",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Login",
    endpoint: "/api/login",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Logout",
    endpoint: "/api/logout",
    method: "POST",
    fields: {},
  },
  {
    name: "Update User",
    endpoint: "/api/users",
    method: "PATCH",
    fields: { update: { username: "input", password: "input" } },
  },
  {
    name: "Delete User",
    endpoint: "/api/users",
    method: "DELETE",
    fields: {},
  },
  {
    name: "Get Users (empty for all)",
    endpoint: "/api/users/:username",
    method: "GET",
    fields: { username: "input" },
  },
  {
    name: "Get User Karma",
    endpoint: "/api/users/:username/karma",
    method: "GET",
    fields: { username: "input" },
  },
  {
    name: "Create Post",
    endpoint: "/api/posts",
    method: "POST",
    fields: { content: "input" },
  },
  {
    name: "Update Post",
    endpoint: "/api/posts/:id",
    method: "PATCH",
    fields: { id: "input", update: { content: "input", options: { backgroundColor: "input" } } },
  },
  {
    name: "Delete Post",
    endpoint: "/api/posts/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Get Posts (empty for all)",
    endpoint: "/api/posts",
    method: "GET",
    fields: { author: "input" },
  },
  {
    name: "Get Post Likes",
    endpoint: "/api/posts/:id/likes",
    method: "GET",
    fields: { id: "input" },
  },
  {
    name: "Like Post",
    endpoint: "/api/posts/:id/like",
    method: "PATCH",
    fields: { id: "input" },
  },
  {
    name: "Dislike Post",
    endpoint: "/api/posts/:id/dislike",
    method: "PATCH",
    fields: { id: "input" },
  },
  {
    name: "Unlike/Undislike Post",
    endpoint: "/api/posts/:id/neutral_like",
    method: "PATCH",
    fields: { id: "input" },
  },
  {
    name: "Get Post Trusts",
    endpoint: "/api/posts/:id/trusts",
    method: "GET",
    fields: { id: "input" },
  },
  {
    name: "Trust Post",
    endpoint: "/api/posts/:id/trust",
    method: "PATCH",
    fields: { id: "input" },
  },
  {
    name: "Mistrust Post",
    endpoint: "/api/posts/:id/mistrust",
    method: "PATCH",
    fields: { id: "input" },
  },
  {
    name: "Untrust/Unmistrust Post",
    endpoint: "/api/posts/:id/neutral_trust",
    method: "PATCH",
    fields: { id: "input" },
  },
  {
    name: "Create Comment",
    endpoint: "/api/comments",
    method: "POST",
    fields: { content: "input", target: "input" },
  },
  {
    name: "Update Comment",
    endpoint: "/api/comments/:id",
    method: "PATCH",
    fields: { id: "input", update: { content: "input" } },
  },
  {
    name: "Delete Comment",
    endpoint: "/api/comments/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Get Comments (empty for all)",
    endpoint: "/api/comments",
    method: "GET",
    fields: { author: "input" },
  },
  {
    name: "Get Comment Likes",
    endpoint: "/api/comments/:id/likes",
    method: "GET",
    fields: { id: "input" },
  },
  {
    name: "Like Comment",
    endpoint: "/api/comments/:id/like",
    method: "PATCH",
    fields: { id: "input" },
  },
  {
    name: "Dislike Comment",
    endpoint: "/api/comments/:id/dislike",
    method: "PATCH",
    fields: { id: "input" },
  },
  {
    name: "Unlike/Undislike Comment",
    endpoint: "/api/comments/:id/neutral_like",
    method: "PATCH",
    fields: { id: "input" },
  },
  {
    name: "Get Comment Trusts",
    endpoint: "/api/comments/:id/trusts",
    method: "GET",
    fields: { id: "input" },
  },
  {
    name: "Trust Comment",
    endpoint: "/api/comments/:id/trust",
    method: "PATCH",
    fields: { id: "input" },
  },
  {
    name: "Mistrust Comment",
    endpoint: "/api/comments/:id/mistrust",
    method: "PATCH",
    fields: { id: "input" },
  },
  {
    name: "Untrust/Unmistrust Comment",
    endpoint: "/api/comments/:id/neutral_trust",
    method: "PATCH",
    fields: { id: "input" },
  },
];

// Do not edit below here.
// If you are interested in how this works, feel free to ask on forum!

function updateResponse(code: string, response: string) {
  document.querySelector("#status-code")!.innerHTML = code;
  document.querySelector("#response-text")!.innerHTML = response;
}

async function request(method: HttpMethod, endpoint: string, params?: unknown) {
  try {
    if (method === "GET" && params) {
      endpoint += "?" + new URLSearchParams(params as Record<string, string>).toString();
      params = undefined;
    }

    const res = fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: params ? JSON.stringify(params) : undefined,
    });

    return {
      $statusCode: (await res).status,
      $response: await (await res).json(),
    };
  } catch (e) {
    console.log(e);
    return {
      $statusCode: "???",
      $response: { error: "Something went wrong, check your console log.", details: e },
    };
  }
}

function fieldsToHtml(fields: Record<string, Field>, indent = 0, prefix = ""): string {
  return Object.entries(fields)
    .map(([name, tag]) => {
      return `
        <div class="field" style="margin-left: ${indent}px">
          <label>${name}:
          ${typeof tag === "string" ? `<${tag} name="${prefix}${name}"></${tag}>` : fieldsToHtml(tag, indent + 10, prefix + name + ".")}
          </label>
        </div>`;
    })
    .join("");
}

function getHtmlOperations() {
  return operations.map((operation) => {
    return `<li class="operation">
      <h3>${operation.name}</h3>
      <form class="operation-form">
        <input type="hidden" name="$endpoint" value="${operation.endpoint}" />
        <input type="hidden" name="$method" value="${operation.method}" />
        ${fieldsToHtml(operation.fields)}
        <button type="submit">Submit</button>
      </form>
    </li>`;
  });
}

function prefixedRecordIntoObject(record: Record<string, string>) {
  const obj: any = {}; // eslint-disable-line
  for (const [key, value] of Object.entries(record)) {
    if (!value) {
      continue;
    }
    const keys = key.split(".");
    const lastKey = keys.pop()!;
    let currentObj = obj;
    for (const key of keys) {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    currentObj[lastKey] = value;
  }
  return obj;
}

async function submitEventHandler(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const { $method, $endpoint, ...reqData } = Object.fromEntries(new FormData(form));

  // Replace :param with the actual value.
  const endpoint = ($endpoint as string).replace(/:(\w+)/g, (_, key) => {
    const param = reqData[key] as string;
    delete reqData[key];
    return param;
  });

  const data = prefixedRecordIntoObject(reqData as Record<string, string>);

  updateResponse("", "Loading...");
  const response = await request($method as HttpMethod, endpoint as string, Object.keys(data).length > 0 ? data : undefined);
  updateResponse(response.$statusCode.toString(), JSON.stringify(response.$response, null, 2));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#operations-list")!.innerHTML = getHtmlOperations().join("");
  document.querySelectorAll(".operation-form").forEach((form) => form.addEventListener("submit", submitEventHandler));
});
