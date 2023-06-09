package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/emilmalmsten/my_top_xyz/backend/internal/auth"
	"github.com/emilmalmsten/my_top_xyz/backend/internal/database"
)

type createUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (cfg *apiConfig) handlerUsersCreate(w http.ResponseWriter, r *http.Request) {
	type resp struct {
		Id int `json:"id"`
	}

	decoder := json.NewDecoder(r.Body)
	createUserRequest := createUserRequest{}
	err := decoder.Decode(&createUserRequest)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters")
		return
	}

	hashedPassword, err := auth.HashPassword(createUserRequest.Password)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't hash password")
		return
	}

	createdUser, err := cfg.DB.InsertUser(database.User{
		Email:          createUserRequest.Email,
		HashedPassword: hashedPassword,
	})
	if err != nil {
		fmt.Println(err)
		if errors.Is(err, database.ErrAlreadyExist) {
			respondWithError(w, http.StatusNotFound, "Email already in use")
			return
		}
		respondWithError(w, http.StatusInternalServerError, "Error occurred when creating new user")
		return
	}

	respondWithJSON(w, http.StatusCreated, resp{
		Id: createdUser.ID,
	})
}
