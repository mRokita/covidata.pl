import React, {useEffect, useState} from 'react';
import ReactMarkdown from "react-markdown";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import "../../article.css";

export function MarkdownPage({src}){
    const [content, setContent] = useState('');
    useEffect(() => {
        axios.get(src)
            .then(
                (response) => setContent(response.data)
            )
    }, [src]);
    return <React.Fragment>
        <Container component={Paper} style={{padding: 20}}>
            <ReactMarkdown
                className={"markdown-body"}
                source={content}
                escapeHtml={false}
                skipHtml={false}
            />
        </Container>
    </React.Fragment>
}