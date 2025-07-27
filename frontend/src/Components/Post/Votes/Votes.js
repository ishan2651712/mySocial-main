import React from 'react';
import UpvoteButton from './UpvoteButton/UpvoteButton';
import DownvoteButton from './DownvoteButton/DownvoteButton';
import classes from './Votes.module.css';

const Votes = (props) => {
    const { upHandler, downHandler, up, down, upvotes, downvotes } = props;
    return (
        <div className={classes.VoteCounter}>
            <span className={classes.Vote} onClick={upHandler}>
                <UpvoteButton red={up} upvotes={upvotes} />
            </span>

            <span className={classes.Vote} onClick={downHandler}>
                <DownvoteButton blue={down} downvotes={downvotes} />
            </span>
        </div>
    );
};

export default Votes;
