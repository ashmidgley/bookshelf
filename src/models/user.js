class User {
    constructor(id, email, isAdmin){
        this.id = id;
        this.email = email;
        this.isAdmin = isAdmin;
    }

    id;
    email;
    isAdmin;
}

export default User;