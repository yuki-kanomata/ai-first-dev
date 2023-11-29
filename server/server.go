package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Task struct {
	gorm.Model
	Subject string
	DueDate time.Time
	IsDone  bool
}

func main() {
	db, err := gorm.Open("postgres", "host=localhost user=postgres dbname=postgres sslmode=disable password=postgres")
	if err != nil {
		panic("failed to connect database")
	}
	defer db.Close()

	if db.HasTable(&Task{}) {
		db.DropTable(&Task{})
	}

	db.AutoMigrate(&Task{})

	for i := 1; i <= 10; i++ {
		task := Task{Subject: "Task " + strconv.Itoa(i), DueDate: time.Now().AddDate(0, 0, i), IsDone: false}
		db.Create(&task)
	}

	e := echo.New()

	// CORSの設定
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))

	// タスク一覧を取得するAPI
	e.GET("/tasks", func(c echo.Context) error {
		var tasks []Task
		db.Find(&tasks)
		return c.JSON(http.StatusOK, tasks)
	})

	// 新しいタスクを登録するAPI
	e.POST("/tasks", func(c echo.Context) error {
		task := new(Task)
		if err := c.Bind(task); err != nil {
			return err
		}
		task.IsDone = false
		db.Create(&task)
		return c.JSON(http.StatusCreated, task)
	})

	// タスクを更新するAPI
	e.PUT("/tasks/:id", func(c echo.Context) error {
		id, _ := strconv.Atoi(c.Param("id"))
		var task Task
		db.First(&task, id)
		if err := c.Bind(&task); err != nil {
			return err
		}
		db.Save(&task)
		return c.JSON(http.StatusOK, task)
	})

	// タスクを削除するAPI
	e.DELETE("/tasks/:id", func(c echo.Context) error {
		id, _ := strconv.Atoi(c.Param("id"))
		var task Task
		db.First(&task, id)
		db.Delete(&task)
		return c.NoContent(http.StatusNoContent)
	})

	e.Start(":8080")
}
