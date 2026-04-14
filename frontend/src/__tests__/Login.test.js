import { render, screen } from "@testing-library/react";
import Login from "../pages/Login";
import { UserContext } from "../context/UserContext";

// FIX: Mock router
jest.mock("react-router-dom", () => ({
Link: ({ children }) => children,
useNavigate: () => jest.fn(),
}));

describe("Login Page Tests", () => {
test("renders login form", () => {
render(
<UserContext.Provider value={{ saveToken: jest.fn(), refreshUser: jest.fn() }}> <Login />
</UserContext.Provider>
);

expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
expect(screen.getByText(/login/i)).toBeInTheDocument();

});
});
