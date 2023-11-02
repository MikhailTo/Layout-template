# Layout-template
Template for layout of sites with gulp, html, sass and js

## Must be installed:
1. [Git](https://git-scm.com/downloads)
2. [NodeJS](https://nodejs.org/en/download)
3. [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)
```
npm install -g npm-check-updates
```
## For start:
В директории с вашими проектами создайте bash файл под названием new_project.sh со следующим содержимым:
```
#!/bin/bash
echo Дайте название проекту:
read NAME_PROJECT
mkdir $NAME_PROJECT
cd $NAME_PROJECT
git clone https://github.com/MikhailTo/layout-template.git .
ncu -u --packageFile package.json
npm i
npm pkg set name="$NAME_PROJECT"
code .

```
Где code - переменная среды Windows для запуска Visual Studio Code, равная директории: 
```
C:\Users\<Name_user>\AppData\Local\Programs\Microsoft VS Code\Code.exe
```
