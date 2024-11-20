export const checkAuthAndGetUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return null; 
    }
    try {
        const decodedUser = JSON.parse(atob(token.split(".")[1]));
        return decodedUser.id; 
    } catch (error) {
        console.error("Invalid token:", error);
        window.location.href = "/login"; 
        return null;
    }
};
