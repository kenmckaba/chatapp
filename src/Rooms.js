import React from "react";
import {
  Button,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  CircularProgress,
  Fab
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import uuid from "uuid/v4";
import { Query, Mutation } from "react-apollo";

const LIST_ROOMS = gql`
  query ListRooms {
    listRooms {
      items {
        __typename
        id
        createdAt
      }
    }
  }
`;

const CREATE_ROOM = gql`
  mutation CreateRoom($id: ID!) {
    createRoom(input: { id: $id }) {
      __typename
      id
      createdAt
    }
  }
`;

export default () => {
  return (
    <>
      <Query query={LIST_ROOMS} fetchPolicy="cache-and-network">
        {({ data, loading, error }) => {
          if (error) return <div>{error.message}</div>;
          if (loading && !data) return <CircularProgress />;
          return (
            <List
              subheader={
                <ListSubheader component="div">List of rooms</ListSubheader>
              }
              dense
            >
              {data?.listRooms?.items.map(room => (
                <ListItem key={room.id} divider>
                  <Button
                    style={{ flex: 1 }}
                    component={Link}
                    to={`/room/${room.id}`}
                  >
                    <ListItemText
                      primary={room.id}
                      secondary={`Created at ${room.createdAt}`}
                    />
                  </Button>
                </ListItem>
              ))}
            </List>
          );
        }}
      </Query>
      <Mutation mutation={CREATE_ROOM}>
        {mutate => (
          <Fab
            color="primary"
            aria-label="Add"
            style={{ position: "absolute", bottom: 10, right: 10 }}
            onClick={() => {
              const id = uuid();
              mutate({
                variables: {
                  id
                },
                optimisticResponse: () => ({
                  createRoom: {
                    __typename: "Room",
                    id,
                    createdAt: new Date()
                  }
                }),
                update: (cache, { data: { createRoom } }) => {
                  const data = cache.readQuery({ query: LIST_ROOMS });

                  data.listRooms.items = [
                    createRoom,
                    ...data.listRooms.items.filter(
                      item => item.id !== createRoom.id
                    )
                  ];

                  cache.writeQuery({ query: LIST_ROOMS, data });
                }
              });
            }}
          >
            <AddIcon />
          </Fab>
        )}
      </Mutation>
    </>
  );
};
