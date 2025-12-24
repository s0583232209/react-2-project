import { Outlet, Link } from "react-router-dom";

export default function Posts(props){
    return (
        <>
        <h1>Posts</h1>

        <Outlet></Outlet>
        </>
    )
}