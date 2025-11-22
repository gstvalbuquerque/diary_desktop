package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"diary/auth"
	"diary/diary"
)

type App struct {
	ctx          context.Context
	userStore    *auth.UserStore
	currentDiary *diary.Diary
	currentUser  string
}

func NewApp() *App {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		fmt.Println("Error getting home directory:", err)
		return &App{}
	}

	baseDir := filepath.Join(homeDir, ".diary")
	if err := os.MkdirAll(baseDir, 0755); err != nil {
		fmt.Println("Error creating application directory:", err)
		return &App{}
	}

	usersFile := filepath.Join(baseDir, "users.json")
	userStore, err := auth.NewUserStore(usersFile)
	if err != nil {
		fmt.Println("Error initializing user store:", err)
		return &App{}
	}

	return &App{
		userStore: userStore,
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Login(username, password string) (string, error) {
	if !a.userStore.Authenticate(username, password) {
		return "", fmt.Errorf("invalid username or password")
	}

	a.currentUser = username
	if err := a.loadDiary(username); err != nil {
		return "", fmt.Errorf("error loading diary: %w", err)
	}

	return "Login successful", nil
}

func (a *App) Register(username, password string) error {
	if err := a.userStore.Register(username, password); err != nil {
		return err
	}
	return nil
}

func (a *App) loadDiary(username string) error {
	homeDir, _ := os.UserHomeDir()
	baseDir := filepath.Join(homeDir, ".diary")
	diaryFile := filepath.Join(baseDir, fmt.Sprintf("%s-diary.json", username))

	d, err := diary.NewDiary(diaryFile)
	if err != nil {
		return err
	}
	a.currentDiary = d
	return nil
}

func (a *App) GetEntry(date string) *diary.DiaryEntry {
	if a.currentDiary == nil {
		return nil
	}
	entry, exists := a.currentDiary.GetEntry(date)
	if !exists {
		return nil
	}
	return &entry
}

func (a *App) SaveEntry(date, section, content string) error {
	if a.currentDiary == nil {
		return fmt.Errorf("no diary loaded")
	}
	return a.currentDiary.AddEntry(date, section, content)
}

func (a *App) ListDates() []string {
	if a.currentDiary == nil {
		return []string{}
	}
	return a.currentDiary.ListDates()
}

func (a *App) DeleteEntry(date string) error {
	if a.currentDiary == nil {
		return fmt.Errorf("no diary loaded")
	}
	return a.currentDiary.DeleteEntry(date)
}

func (a *App) GetCurrentUser() string {
	return a.currentUser
}

func (a *App) Logout() {
	a.currentUser = ""
	a.currentDiary = nil
}
