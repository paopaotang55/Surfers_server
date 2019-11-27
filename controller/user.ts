import { Request, Response } from "express";
import { Users } from "../models/Users"
// import { userInterface } from "../models/Users"
import jwt from 'jsonwebtoken';
import { config } from '../config'

interface Token {
    user_id: number;
    email: string;
}

function tokenVerify(token: string): Boolean {
    try {
        jwt.verify(token, config.secret);
        return true;
    } catch (err) {
        return false;
    }
}
function tokenSign(user: Token): string {
    try {
        return jwt.sign(user, config.secret);
    } catch (err) {
        return err;
    }
}

interface userInterface {
    name: string;
    email: string;
    password?: string;
    oAuth: number;
}


export class User {

    signup(req: Request, res: Response) {
        let array: string[] = Object.keys(req.body);
        if ((array.indexOf('name') === -1) || (array.indexOf('password') === -1) ||
            (array.indexOf('oAuth') === -1) || (array.indexOf('email') === -1)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    message: "body를 다음과 같이 수정해주세요,{email, oAuth, name, password }"
                }
            })
        }
        let name: string = req.body.name;
        let email: string = req.body.email;
        let oAuth: number = +req.body.oAuth;
        if (oAuth === 0) {
            let password: string = req.body.password;
            Users.findOne<Users>({ where: { email } })
                .then((user) => {
                    if (user) {
                        return res.status(409).send({
                            error: {
                                status: 409,
                                message: "이미 사용 중인 email 입니다"
                            }
                        })
                    } else {
                        let user1: userInterface = { name, email, password, oAuth: 0 };
                        Users.create<Users>(user1)
                            .then(() => {
                                return res.status(201).send({ message: "회원가입 성공" });
                            })
                            .catch((err: Error) => {
                                return res.status(500).send({
                                    error: {
                                        status: 500,
                                        message: "회원가입 실패"
                                    }
                                })
                            })
                    }
                })
                .catch((err: Error) => {
                    return res.status(500).send({
                        error: {
                            status: 500,
                            message: "회원가입 실패"
                        }
                    })
                })
        } else {
            //oAuth token 처리 
            res.send("oAuth")
        }
    }
    signin(req: Request, res: Response) {
        let array: string[] = Object.keys(req.body);
        if ((array.indexOf('email') === -1) || (array.indexOf('password') === -1)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    message: "body를 다음과 같이 수정해주세요,{email, password }"
                }
            })
        }
        let email: string = req.body.email;
        let password: string = req.body.password;
        Users.findOne<Users>({ where: { email, password } })
            .then((user) => {
                if (user) {
                    let user_id: number = +user.id;
                    return res.status(200).send({ message: "로그인 완료", token: tokenSign({ user_id, email }) })
                } else {
                    return res.status(406).send({
                        error: {
                            status: 406,
                            message: "회원 정보가 없습니다"
                        }
                    });
                }
            })
            .catch((err) => {
                return res.status(500).send({
                    error: {
                        status: 500,
                        message: "로그인 실패"
                    }
                })
            })
    }

    userPut(req: Request, res: Response) {
        let arr: string[] = Object.keys(req.body);
        if ((arr.indexOf('name') === -1) || (arr.indexOf('password') === -1) ||
            (arr.indexOf('image') === -1) || (arr.indexOf('email') === -1)) {
            return res.status(400).send({
                error: {
                    status: 400,
                    message: "body를 다음과 같이 수정해주세요,{ name, password, image, email }"
                }
            })
        }
        let email: string = req.body.info.email;  // api 
        let name1: string = req.body.name;
        let password1: string = req.body.password;
        let image1: Blob = req.body.image;
        Users.findOne<Users>({ where: { name: name1 } })
            .then((name) => {
                if (name) {
                    return res.status(400).send({
                        error: {
                            status: 409,
                            message: "다른 유저가 사용 중인 이름 입니다."
                        }
                    })
                }
            })
            .catch((err: Error) => {
                return res.status(500).send({
                    error: {
                        status: 500,
                        message: "같은 name 찾기 data 오류"
                    }
                })
            })
        Users.findOne<Users>({ where: { email } })
            .then((user) => {
                let name2: string = (<Users>user).name;
                let password2: string | undefined = (<Users>user).password;
                let image2: Blob | undefined = (<Users>user).image;
                name2 = name1 || name2;
                password2 = password1 || password2;
                image2 = image1 || image2;
                Users.update<Users>({ name: name2, password: password2, image: image2 }, { where: { email } })
                    .then(() => {
                        return res.status(200).send({ message: "회원정보 수정완료" })
                    })
                    .catch((err: Error) => {
                        return res.status(500).send({
                            error: {
                                status: 500,
                                message: "수정 실패"
                            }
                        })
                    })
            })
            .catch((err: Error) => {
                return res.status(500).send({
                    error: {
                        status: 500,
                        message: "수정 실패"
                    }
                })
            })
    }
    token(req: Request, res: Response, next: any) {
        let bearerToken: string | undefined = req.headers.authorization;
        if (!bearerToken) {
            return res.send("token 없음")
        }
        try {
            let token1: string = bearerToken.split(' ')[1];
            console.log(token1)
            if (tokenVerify(token1)) {
                req.body.info = jwt.verify(token1, config.secret)
                console.log(req)
                next();
            } else {
                return res.status(401).send({
                    error: {
                        status: 401,
                        message: "로그인 상태가 아닙니다"
                    }
                })
            }
        } catch (err) {
            return res.status(401).send({
                message: "등록 상태가 아닙니다."
            })
        }
    }
}


