use serde::Deserialize;
use warp::{Filter, Rejection, Reply};

type Result<T> = std::result::Result<T, Rejection>;

#[derive(Deserialize)]
struct LoginRequest {
    email: String,
    password: String,
}

#[tokio::main]
async fn main() {
    let health_route = warp::path!("health").and_then(health_handler);

    let login_route = warp::path!("api" / "login")
        .and(warp::post())
        .and(warp::body::json())
        .and_then(login_handler);

    let routes = warp::any()
        .and(health_route.or(login_route))
        .with(warp::cors().allow_any_origin());

    println!("Started server at localhost:4000");
    warp::serve(routes).run(([0, 0, 0, 0], 4000)).await;
}

async fn health_handler() -> Result<impl Reply> {
    Ok("OK")
}

async fn login_handler(body: LoginRequest) -> Result<impl Reply> {
    
    println!("Username: {}", body.email);
    println!("Password: {}", body.password);

    Ok("Login Successful")
}
