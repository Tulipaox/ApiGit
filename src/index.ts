interface User {
    id: number, 
    login: string,
    name: string,
    bio: string,
    public_repos: number,
    repos_url: string;
};

interface Repository {
    name: string,
    description: string,
    fork: boolean,
    stargazers_count: number
}

let users: User[] = []
let repository: Repository[] = []

async function getUserGit(name: string): Promise<User | { message: string }> {
    const data = await fetch(`https://api.github.com/users/${name}`).then(res => res.json())

    const user = mapToUser(data)
    if (user) {
        users.push(user)
        return user;
    } else {
        console.log({ message: "Not Found" })
        return { message: "Not Found" }
    }
}

function mapToUser(data: any): User | null {
    if (
        typeof data.id === "number" &&
        typeof data.login === "string" &&
        typeof data.repos_url === "string"
    ) {
        return {
            id: data.id,
            login: data.login,
            name: data.name || "",
            bio: data.bio || "",
            public_repos: data.public_repos,
            repos_url: data.repos_url
        };
    }
    return null
}

async function getReposUser(name: string) {
    const userFound = findByUserGit(name)
    const reposFound = await fetch(`${userFound.repos_url}`).then(res => res.json())

    const repos = reposFound.map((repo: any) => mapToRepos(repo)).filter(r => r !== null);
    console.log(repos)

    if(repos){
        repository.push(repos)
        console.log(reposFound)
        return repos
    } else {
        return  console.log({ message: "Not Found" })
    }

}

function findByUserGit(name: string) {
    if (!users || users.length === 0) {
        console.log("Nenhum usuário foi encontrado na lista.");
        return null
    }

    const searchUser = users.find((u) => u.login === name);

    if (!searchUser) {
        console.log(`Usuário com nome "${name}" não foi encontrado.`);
        return null
    }
    return searchUser;
}


function mapToRepos(data: any): Repository | null {
    if (
        typeof data.name === "string" &&
        typeof data.description === "string" && 
        typeof data.fork === "boolean" &&
        typeof data.stargazers_count === 'number'
    ) {
        return {
            name: data.name,
            description: data.description,
            fork: data.fork,
            stargazers_count: data.stargazers_count,
        };
    }
    return null;
}

function listUsers(){
    let list = ""

    users.forEach((user:{
        id: number, 
        login: string,
        name: string,
        bio: string,
        public_repos: number,
        repos_url: string;
    }) =>{
        list += `
        Id: ${user.id}
        Name: ${user.name}
        Login: ${user.login}
        Bio: ${user.bio}
        Public Repository: ${user.public_repos}
        Url Repository: ${user.repos_url}
        `
    })
    console.log(list)
}

function addRepository(){
    const totalPublicRepos = users.reduce((acc, curr) =>{
            return acc + curr.public_repos
    }, 0)

    console.log(`A a soma de todos os Repositório: ${totalPublicRepos}`)
}

function getTopFiveUsers(users: User[]): User[] {
    const sortedUsers = [...users].sort((a, b) => b.public_repos - a.public_repos);
    console.log(sortedUsers.slice(0, 5))
    return sortedUsers.slice(0, 5)
}
