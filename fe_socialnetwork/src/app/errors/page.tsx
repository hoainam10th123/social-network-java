"use client"

import React from "react"
import agent from "../lib/api/agent"
import Button from "react-bootstrap/Button"


export default function Page(){

    const [errors, setError] = React.useState<string[]>([])

    const badRequest = async () => {
        await agent.Error.badRequest()
    }

    const notfound = async () => {
        await agent.Error.notfound()
    }

    const forbidden = async () => {
        await agent.Error.forbidden()
    }

    const Unauthorized = async () => {
        await agent.Error.authorized()
    }

    const ServerError = async () => {
        await agent.Error.serverError()
    }

    const ValidatationError = async () => {
        try {
            await agent.Error.validationError()
        } catch (error:any) {
            console.log(error)
            setError(error)
        }        
    }

    return <>
    <h1>Day la trang test error</h1>
        <Button onClick={badRequest} style={{ margin: 10 }}>badRequest</Button>

        <Button onClick={notfound} style={{ margin: 10 }}>notfound</Button>

        <Button onClick={forbidden} style={{ margin: 10 }}>forbidden</Button>

        <Button onClick={Unauthorized} style={{ margin: 10 }}>Unauthorized</Button>

        <Button onClick={ServerError} style={{ margin: 10 }}>ServerError</Button>

        <Button onClick={ValidatationError} style={{ margin: 10 }}>ValidatationError</Button>

        <div>
            {errors.map((err, ind) => (
                <div key={ind} style={{color: 'red'}}>{err}</div>
            ))}
        </div>
    </>
}