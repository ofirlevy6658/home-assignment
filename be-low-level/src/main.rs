use std::convert::Infallible;
use warp::{http::StatusCode, Filter, Rejection, Reply, reject::Reject};
use serde::{Deserialize, Serialize};
use validator::Validate;
use rand::Rng;


extern crate rand;

#[derive(Debug)]
struct ValidationError;

impl Reject for ValidationError {}

type Result<T> = std::result::Result<T, Rejection>;

#[derive(Deserialize, Validate)]
struct LoginRequest {
    #[validate(email)]
    email: String,
    password: String,
}

#[derive(Serialize)]
struct ErrorMessage {
    error: String,
}
#[derive(Serialize)]
struct TokenResponse {
    token: String,
}

#[derive(Serialize)]  
struct WinResponse {
    win: bool,
}



#[tokio::main]
async fn main() {
    let health_route = warp::path!("health").and_then(health_handler);

    let login_route = warp::path!("api" / "login")
        .and(warp::post())
        .and(warp::body::json())
        .and_then(login_handler);

    let logout_route = warp::path!("api" / "logout")
        .and(warp::post())
        .and_then(logout_handler);

    let try_luck_route = warp::path!("api" / "try_luck")
        .and(warp::post())
        .and_then(try_luck_handler);

    let routes = health_route
        .or(login_route)
        .or(logout_route)
        .or(try_luck_route)  
        .recover(handle_rejection)
        .with(warp::cors().allow_any_origin());

    println!("Server started at localhost:4000");
    warp::serve(routes).run(([0, 0, 0, 0], 4000)).await;
}

async fn health_handler() -> Result<impl Reply> {
    Ok("OK")
}

async fn login_handler(body: LoginRequest) -> Result<impl Reply> {
    if let Err(_) = body.validate() {
        return Err(warp::reject::custom(ValidationError));
    }

    if body.password != "r2isthebest" {
        return Err(warp::reject::custom(ValidationError));
    }


    let token_response = TokenResponse { token: "validToken".into() };
    
    Ok(warp::reply::json(&token_response))

}

async fn logout_handler() -> Result<impl Reply> {
    Ok("\"OK\"")
}

async fn try_luck_handler() -> Result<impl Reply> {
    let mut rng = rand::thread_rng();
    let random_number: f64 = rng.gen();

    let win = if random_number < 0.7 {
        true
    } else {
        false
    };

    let win_response = WinResponse { win };

    Ok(warp::reply::json(&win_response))
}

async fn handle_rejection(err: Rejection) -> std::result::Result<impl Reply, Infallible> {
    let code;
    let error_message;

    if err.is_not_found() {
        code = StatusCode::NOT_FOUND;
        error_message = "Not Found";
    } else if err.find::<ValidationError>().is_some() {
        code = StatusCode::UNAUTHORIZED;
        error_message = "Wrong email and password";
    } else {
        code = StatusCode::INTERNAL_SERVER_ERROR;
        error_message = "Internal Server Error";
    }

    let json = warp::reply::json(&ErrorMessage {
        error: error_message.to_string(),
    });

    Ok(warp::reply::with_status(json, code))
}
