import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { UserContext } from "../context/UserContext";

// FIX: Mock router FIRST
jest.mock("react-router-dom", () => ({
Link: ({ children }) => children,
useNavigate: () => jest.fn(),
}));

// Mock authFetch
jest.mock("../utils/authFetch", () => ({
authFetch: jest.fn(() =>
Promise.resolve({
ok: true,
json: () =>
Promise.resolve([
{
id: "1",
content: "Test post",
userName: "Dhruti",
},
]),
})
),
}));

describe("Dashboard Tests", () => {
test("renders loading text initially", () => {
render(
<UserContext.Provider value={{ user: { userName: "Dhruti", role: "Student" } }}> <Dashboard />
</UserContext.Provider>
);

expect(screen.getByText(/loading posts/i)).toBeInTheDocument();

});

test("renders posts after fetch", async () => {
render(
<UserContext.Provider value={{ user: { userName: "Dhruti", role: "Student" } }}> <Dashboard />
</UserContext.Provider>
);

const post = await screen.findByText(/test post/i);
expect(post).toBeInTheDocument();

});
});
