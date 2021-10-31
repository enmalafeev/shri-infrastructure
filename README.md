# Домашнее задание ШРИ: Инфраструктура

В проект добавлены 3 bash-скрипта для автоматизации инфрастуктурынх задач. А также настроен github-action на пуш в репозиторий нового релизного тега.
Для создания нового тега в репозиторий и автоматизации создания changelog-файла в репозиторий добавлен пакет `standard-version`
Для создания нового тега релиза используется команда `npm run release`, которая создает новый релизный тег и формирует файл CHANGELOG.md

## Скрипт оформления релиза:

- определяет версию релиза (соответствует последнему релизному тэгу)
- создает запись в реестре релизов (Яндекс.Трекер) и сохраняет в описании - автора, дату релиза и номер версии
- добавляет changelog из файла CHANGELOG.md в комментарий к релизному тикету
- при запуске скрипта повторно с уже существующим релизным тэгом новый тикет не создается, информация обновляется в существующем релизном тикете
- в случае возникновения ошибки при отправке запроса в Трекер выполнение дальнейших шагов не происходит
