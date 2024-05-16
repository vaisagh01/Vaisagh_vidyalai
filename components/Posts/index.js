import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';
import { fetchPosts } from '../../server/posts/posts.service';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));
const PostUserDetails = styled.div(()=> ({
  justifyContent: 'start',
  padding:'10px',
  margin:'0px 12px 0px 12px',
  border: '1px solid lightgray',
  borderRadius: 5,
  display:"flex",
  gap:"5px",
  justifyItems:"start",
  alignItems:"center"

}))
const UserDetails = styled.div(()=> ({
  backgroundColor:"gray",
  width:"30px",
  textAlign:"center",
  height:"30px",
  padding:'10px',
  border: '1px solid lightgray',
  borderRadius: 100,
  fontSize:"20px",
  color:"lightgray",
  fontWeight:700
}))
const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [users, setUsers] = useState([]);

  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    const fetchPost = async () => {
      const limit = isSmallerDevice ? 5 : 10;
      const offset = (currentPage - 1) * limit;

      const { data: newPosts } = await axios.get('/api/v1/posts', {
        params: { start: offset, limit },
      });
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setIsLoading(false);
      setHasMorePosts(newPosts.length === limit)
    };

    fetchPost();
  }, [currentPage, isSmallerDevice]);

  const handleClick = async () => {
    setIsLoading(true);
    if (hasMorePosts) {
      setCurrentPage(currentPage + 1);
      await fetchPosts;
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const { data: users } = await axios.get('/api/v1/users');
      setUsers(users);
    };
    fetchData();
  }, []);

  return (
    <Container>
      <PostListContainer>
        {
          posts.map(post => (
            <>
              {
                users.map(user => (
                  <div>
                    <PostUserDetails>
                      <UserDetails>
                        {(user.name.split(" ")[0].split("")[0])}
                        {(user.name.split(" ")[1].split("")[0])}
                      </UserDetails>
                      <h5>{user.name}
                        <p style={{fontWeight:"500", color:"gray"}}>{user.email}</p>
                      </h5>
                      
                    </PostUserDetails>
                    <Post post={post} users={users}  />
                  </div>
                ))
              }
            </>
          ))
        }
        
        
      </PostListContainer>

      {hasMorePosts && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}
