import React, {useEffect, useState} from 'react';
import ReactMarkdown from "react-markdown";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import {Helmet} from "react-helmet";
import "../../article.css";

export function MarkdownPage({src, title, description}){
    const [content, setContent] = useState('');

    useEffect(() => {
        axios.get(src)
            .then(
                (response) => setContent(response.data)
            )
    }, [src]);
    return <React.Fragment>
        <Container component={Paper} style={{padding: 20}}>
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description}/>
            </Helmet>
            <ReactMarkdown
                className={"markdown-body"}
                source={content}
                escapeHtml={false}
                skipHtml={false}
            />
        </Container>
    </React.Fragment>
}