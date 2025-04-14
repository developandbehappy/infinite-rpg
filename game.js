// Основные элементы игры
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOver');
const restartButton = document.getElementById('restartButton');

// Установка размеров canvas
canvas.width = 800;
canvas.height = 600;

// Состояние игры
let gameRunning = true;
let score = 0;
let maze = [];
let mazeSize = 20; // Размер части лабиринта
let tileSize = 40;
let visibleTiles = 30; // Сколько тайлов видно на экране
let cameraOffsetX = 0;
let cameraOffsetY = 0;

// Игрок
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    speed: 3,
    level: 1,
    xp: 0,
    xpToLevel: 100,
    health: 100,
    maxHealth: 100,
    damage: 10,
    grid: ["0000000110000000",
        "0000001111000000",
        "0000011111100000",
        "0000111111110000",
        "0000111111110000",
        "0000111111110000",
        "0001111111111000",
        "1111111111111000",
        "0111111111110000",
        "0011111111100000",
        "0001111111000000",
        "0000111110000000",
        "0000011111000000",
        "0000011011100000",
        "0000110001110000",
        "0001100000110000"],
    weapon: {
        name: "Пистолет",
        level: 1,
        attackSpeed: 1,
        bulletSize: 5,
        bulletSpeed: 5,
        bulletType: "beam", // normal, big, beam
        upgradeChance: 0.6
    }
};

// Пули
let bullets = [];
let lastShotTime = 0;

// Предметы
let items = [];

// Монстры
let monsters = [];
const monsterTypes = [
    {
        name: "Слизь",
        color: "green",
        health: 30,
        damage: 5,
        speed: 1,
        size: 15,
        xpReward: 10,
        grid: [
            "0000111100000000",
            "0011111111000000",
            "0111111111110000",
            "1111111111111000",
            "1111111111111100",
            "1111111111111110",
            "1111111111111110",
            "1111100011111110",
            "1111100011111110",
            "1111111111111110",
            "1111111111111110",
            "1111111111111100",
            "0111111111111000",
            "0011111111110000",
            "0001111111100000",
            "0000111100000000"
        ]
    },
    {
        name: "Скелет",
        color: "white",
        health: 50,
        damage: 10,
        speed: 1.5,
        size: 18,
        xpReward: 15,
        grid: [
            "0000111111000000",
            "0001111111100000",
            "0011101101110000",
            "0111101101111000",
            "0111111111111000",
            "0111111111111000",
            "0011111111110000",
            "0001111111100000",
            "0000111111000000",
            "0001111111100000",
            "0011111111110000",
            "0111101101111000",
            "0111000000111000",
            "0110000000011000",
            "0101000000101000",
            "0101000000101000"
        ]
    },
    {
        name: "Зомби",
        color: "brown",
        health: 80,
        damage: 15,
        speed: 0.8,
        size: 20,
        xpReward: 20,
        grid: [
            "0000111111000000",
            "0001111111100000",
            "0011111111110000",
            "0111101101111000",
            "0111100001111000",
            "0111111111111000",
            "0111111111111000",
            "0011111111110000",
            "0001111111100000",
            "0011111111110000",
            "0111111111111000",
            "0111111111111000",
            "0111100001111000",
            "0111000000111000",
            "0110000000011000",
            "0001000000100000"
        ]
    },
    {
        name: "Призрак",
        color: "rgba(255, 255, 255, 0.5)",
        health: 40,
        damage: 20,
        speed: 2,
        size: 16,
        xpReward: 25,
        grid: [
            "0000111111000000",
            "0011111111110000",
            "0111111111111000",
            "1111100001111100",
            "1111100001111100",
            "1111100001111100",
            "1111111111111100",
            "1111111111111100",
            "1111111111111100",
            "1111111111111100",
            "1111111111111100",
            "1111111111111100",
            "1111011110111100",
            "1111000000111100",
            "1110000000011100",
            "1100000000001100"
        ]
    },
    {
        name: "Гоблин",
        color: "lightgreen",
        health: 60,
        damage: 12,
        speed: 1.7,
        size: 17,
        xpReward: 18,
        grid: [
            "0000011110000000",
            "0000111111000000",
            "0001111111100000",
            "0011111111110000",
            "0111101101111000",
            "0111100001111000",
            "0111111111111000",
            "0011111111110000",
            "0001111111100000",
            "0001111111100000",
            "0001111111100000",
            "0001111111100000",
            "0001111111100000",
            "0001110011100000",
            "0001100001100000",
            "0001000000100000"
        ]
    },
    {
        name: "Орк",
        color: "darkgreen",
        health: 120,
        damage: 25,
        speed: 0.7,
        size: 25,
        xpReward: 30,
        grid: [
            "0000111111110000",
            "0001111111111000",
            "0011111111111100",
            "0111101101111110",
            "0111110001111110",
            "0111111111111110",
            "0111111111111110",
            "0011111111111100",
            "0001111111111000",
            "0011111111111100",
            "0111111111111110",
            "0111111111111110",
            "0111111111111110",
            "0111110001111110",
            "0111100000111110",
            "0011000000011100"
        ]
    },
    {
        name: "Вампир",
        color: "darkred",
        health: 90,
        damage: 18,
        speed: 1.2,
        size: 19,
        xpReward: 28,
        grid: [
            "0000001111000000",
            "0000011111100000",
            "0000111111110000",
            "0001111111111000",
            "0011110110111100",
            "0111110000111110",
            "0111110000111110",
            "0111111111111110",
            "0011111111111100",
            "0001111111111000",
            "0000111111110000",
            "0001111111111000",
            "0011100000111100",
            "0111000000011110",
            "0110000000001110",
            "0100000000000110"
        ]
    },
    {
        name: "Демон",
        color: "red",
        health: 150,
        damage: 30,
        speed: 1,
        size: 22,
        xpReward: 35,
        grid: [
            "1000000000000001",
            "1100000000000011",
            "0110000000000110",
            "0011000000001100",
            "0001111111111000",
            "0011111111111100",
            "0111101101111110",
            "1111100001111111",
            "1111100001111111",
            "1111111111111111",
            "0111111111111110",
            "0011111111111100",
            "0001111111111000",
            "0000111111110000",
            "0000011111100000",
            "0000000110000000"
        ]
    },
    {
        name: "Колдун",
        color: "purple",
        health: 70,
        damage: 35,
        speed: 1.3,
        size: 18,
        xpReward: 27,
        grid: [
            "0000001111000000",
            "0000011111100000",
            "0000111111110000",
            "0001111111111000",
            "0011111111111100",
            "0111101101111110",
            "0111100001111110",
            "0111111111111110",
            "0011111111111100",
            "0001111111111000",
            "0000111111110000",
            "0000111111110000",
            "0001111111111000",
            "0011111111111100",
            "0111111111111110",
            "1111111111111111"
        ]
    },
    {
        name: "Дракон",
        color: "orange",
        health: 200,
        damage: 40,
        speed: 0.5,
        size: 30,
        xpReward: 50,
        grid: [
            "1000000000000001",
            "1100000000000011",
            "0110000000000110",
            "0011000000001100",
            "0001110000111000",
            "0000111001110000",
            "0000011111100000",
            "0000111111110000",
            "0001111111111000",
            "0011101101111100",
            "0111100001111110",
            "1111100001111111",
            "1111111111111111",
            "1111111111111111",
            "0111111111111110",
            "0000111111110000"
        ]
    }
];


// Интерфейс
const uiElements = {
    level: document.getElementById('level'),
    xp: document.getElementById('xp'),
    xpToLevel: document.getElementById('xpToLevel'),
    health: document.getElementById('health'),
    maxHealth: document.getElementById('maxHealth'),
    damage: document.getElementById('damage'),
    attackSpeed: document.getElementById('attackSpeed'),
    weaponName: document.getElementById('weaponName'),
    weaponLevel: document.getElementById('weaponLevel'),
    score: document.getElementById('score'),
    finalScore: document.getElementById('finalScore')
};

// Управление
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

// Мышь
let mouseX = 0;
let mouseY = 0;
let clicking = false;
const mazeChunks = {};
// Создаем кеш для хранения тайлов
const tileCache = new Map();
// Создаем кеш для хранения созданных чанков
const chunkCache = new Map();

// Генерация лабиринта
function generateMazeChunk(startX, startY, chunkSize) {

    const chunkKey = `${startX},${startY}`;

    // Проверяем, был ли этот чанк уже сгенерирован
    if (mazeChunks[chunkKey]) {
        return mazeChunks[chunkKey];
    }

    const chunk = [];

    // Сначала заполняем массив базовыми значениями
    for (let y = 0; y < chunkSize; y++) {
        for (let x = 0; x < chunkSize; x++) {
            const absoluteX = startX + x;
            const absoluteY = startY + y;

            // Используем псевдослучайное число для генерации лабиринта
            const noise = Math.sin(absoluteX * 0.1) * Math.sin(absoluteY * 0.1) * 10;

            // Определяем, является ли ячейка стеной
            const isWall = Math.abs(noise) > 0.7;

            chunk.push({
                x: absoluteX,
                y: absoluteY,
                isWall: isWall
            });
        }
    }

    // Затем проходим и обеспечиваем наличие проходов
    for (let y = 1; y < chunkSize - 1; y++) {
        for (let x = 1; x < chunkSize - 1; x++) {
            const idx = y * chunkSize + x;

            // Проверяем, не образуется ли тупик
            const up = chunk[(y - 1) * chunkSize + x].isWall;
            const down = chunk[(y + 1) * chunkSize + x].isWall;
            const left = chunk[y * chunkSize + (x - 1)].isWall;
            const right = chunk[y * chunkSize + (x + 1)].isWall;

            // Если слишком много стен вокруг, делаем проход
            if ((up && left) || (up && right) || (down && left) || (down && right)) {
                chunk[idx].isWall = false;
            }

            // Добавляем немного случайных проходов
            if (Math.random() < 0.05) {
                chunk[idx].isWall = false;
            }
        }
    }

    // Гарантируем, что края не все стены
    for (let i = 0; i < chunkSize; i++) {
        // Создаем проходы по краям с некоторой вероятностью
        if (Math.random() < 0.3) {
            chunk[i].isWall = false; // Верхний край
            chunk[(chunkSize - 1) * chunkSize + i].isWall = false; // Нижний край
            chunk[i * chunkSize].isWall = false; // Левый край
            chunk[i * chunkSize + chunkSize - 1].isWall = false; // Правый край
        }
    }

    return chunk;
}

// Инициализация лабиринта
function initMaze() {
    const chunkX = Math.floor(player.x / tileSize / mazeSize);
    const chunkY = Math.floor(player.y / tileSize / mazeSize);

    maze = generateMazeChunk(chunkX * mazeSize, chunkY * mazeSize, mazeSize);
}

// Поиск тайлов в лабиринте
// Поиск тайлов в лабиринте с использованием кеша
function getTileAt(x, y) {
    const worldX = Math.floor(x / tileSize);
    const worldY = Math.floor(y / tileSize);

    // Создаем ключ для кеша
    const cacheKey = `${worldX},${worldY}`;

    // Проверяем, есть ли тайл в кеше
    if (tileCache.has(cacheKey)) {
        return tileCache.get(cacheKey);
    }

    // Ищем тайл в существующем лабиринте
    for (let tile of maze) {
        if (tile.x === worldX && tile.y === worldY) {
            // Сохраняем найденный тайл в кеш
            tileCache.set(cacheKey, tile);
            return tile;
        }
    }

    // Если тайл не найден, создаем новый чанк
    const chunkX = Math.floor(worldX / mazeSize) * mazeSize;
    const chunkY = Math.floor(worldY / mazeSize) * mazeSize;

    // Проверяем, был ли уже создан такой чанк
    const chunkKey = `${chunkX},${chunkY}`;

    if (!chunkCache.has(chunkKey)) {
        const newChunk = generateMazeChunk(chunkX, chunkY, mazeSize);
        maze = maze.concat(newChunk);

        // Сохраняем информацию о созданном чанке
        chunkCache.set(chunkKey, true);

        // Добавляем все тайлы чанка в кеш
        for (const tile of newChunk) {
            tileCache.set(`${tile.x},${tile.y}`, tile);
        }
    }

    // Теперь тайл должен быть в кеше или в лабиринте
    return getTileAt(x, y);
}

// Создание монстра
function spawnMonster() {
    // Определяем случайную позицию вокруг игрока, но не слишком близко
    const angle = Math.random() * Math.PI * 2;
    const distance = 400 + Math.random() * 200;
    const x = player.x + Math.cos(angle) * distance;
    const y = player.y + Math.sin(angle) * distance;

    // Проверяем, что монстр не появится в стене
    const tile = getTileAt(x, y);
    if (tile && tile.isWall) return;

    // Выбираем тип монстра в зависимости от уровня игрока
    let availableTypes = monsterTypes.slice(0, Math.min(player.level, monsterTypes.length));
    const typeIndex = Math.floor(Math.random() * availableTypes.length);
    const type = availableTypes[typeIndex];

    // Создаем монстра с учетом уровня игрока (монстры становятся сильнее)
    const levelMultiplier = 1 + (player.level - 1) * 0.1;

    monsters.push({
        x: x,
        y: y,
        type: type,
        health: type.health * levelMultiplier,
        maxHealth: type.health * levelMultiplier,
        damage: type.damage * levelMultiplier,
        speed: type.speed,
        size: type.size,
        xpReward: type.xpReward
    });
}

// Создание предмета
function createItem(x, y) {
    const itemTypes = ["health", "damage", "attackSpeed", "weaponUpgrade"];
    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];

    items.push({
        x: x,
        y: y,
        type: type,
        size: 10,
        color: type === "health" ? "red" : type === "damage" ? "orange" :
            type === "attackSpeed" ? "blue" : "purple"
    });
}

// Обновление состояния игрока
function updatePlayer() {
    // Движение
    let dx = 0;
    let dy = 0;

    if (keys.w) dy -= player.speed;
    if (keys.s) dy += player.speed;
    if (keys.a) dx -= player.speed;
    if (keys.d) dx += player.speed;

    // Нормализация диагонального движения
    if (dx !== 0 && dy !== 0) {
        dx *= 0.7071; // sqrt(2)/2
        dy *= 0.7071;
    }

    // Проверка столкновений со стенами
    const newX = player.x + dx;
    const newY = player.y + dy;

    const tileNewX = getTileAt(newX, player.y);
    const tileNewY = getTileAt(player.x, newY);

    if (!tileNewX.isWall) player.x = newX;
    if (!tileNewY.isWall) player.y = newY;

    // Стрельба
    const now = Date.now();
    if (clicking && now - lastShotTime >= 1000 / player.weapon.attackSpeed) {
        // Направление пули
        const dx = mouseX - (player.x - cameraOffsetX);
        const dy = mouseY - (player.y - cameraOffsetY);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const dirX = dx / distance;
        const dirY = dy / distance;

        bullets.push({
            x: player.x,
            y: player.y,
            startX: player.x, // Добавление начальной точки для луча
            startY: player.y, // Добавление начальной точки для луча
            dirX: dirX,
            dirY: dirY,
            speed: player.weapon.bulletSpeed,
            size: player.weapon.bulletSize,
            type: player.weapon.bulletType,
            damage: player.damage,
            bounces: 0,
            maxBounces: 3
        });

        lastShotTime = now;
    }

    // Сбор предметов
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const dx = item.x - player.x;
        const dy = item.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.size + item.size) {
            // Применяем эффект предмета
            applyItemEffect(item);
            items.splice(i, 1);
        }
    }

    // Столкновения с монстрами
    for (let monster of monsters) {
        const dx = monster.x - player.x;
        const dy = monster.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.size + monster.size) {
            // Игрок получает урон
            player.health -= monster.damage;

            // Отталкивание игрока
            const pushDistance = 20;
            const pushX = (dx / distance) * pushDistance;
            const pushY = (dy / distance) * pushDistance;

            // Проверяем, не попадем ли мы в стену
            const newX = player.x - pushX;
            const newY = player.y - pushY;

            const tileNewX = getTileAt(newX, player.y);
            const tileNewY = getTileAt(player.x, newY);

            if (!tileNewX.isWall) player.x = newX;
            if (!tileNewY.isWall) player.y = newY;

            // Проверка смерти
            if (player.health <= 0) {
                gameOver();
            }
        }
    }
}

// Применение эффекта предмета
function applyItemEffect(item) {
    switch (item.type) {
        case "health":
            player.health = Math.min(player.health + player.maxHealth * 0.3, player.maxHealth);
            showFloatingText("+здоровье", player.x, player.y - 20, "green");
            break;
        case "damage":
            player.damage += 5;
            showFloatingText("+урон", player.x, player.y - 20, "orange");
            break;
        case "attackSpeed":
            player.weapon.attackSpeed += 0.2;
            showFloatingText("+скорость атаки", player.x, player.y - 20, "blue");
            break;
        case "weaponUpgrade":
            attemptWeaponUpgrade();
            break;
    }
    updateUI();
}

// Попытка улучшить оружие
function attemptWeaponUpgrade() {
    if (Math.random() < player.weapon.upgradeChance) {
        player.weapon.level++;

        // Улучшаем оружие в зависимости от его уровня
        if (player.weapon.level < 5) {
            player.weapon.bulletSize += 2;
            player.weapon.attackSpeed += 0.3;
            player.weapon.name = `Улучшенный пистолет`;
            player.weapon.bulletType = "normal";
        } else if (player.weapon.level < 10) {
            player.weapon.bulletSize = 1;
            player.weapon.attackSpeed += 0.4;
            player.weapon.name = `Дробовик`;
            player.weapon.bulletType = "big";
        } else {
            player.weapon.bulletSize += 4;
            player.weapon.attackSpeed += 0.5;
            player.weapon.name = `Лазерный пистолет`;
            player.weapon.bulletType = "beam";
        }

        showFloatingText("Оружие улучшено!", player.x, player.y - 20, "purple");
    } else {
        showFloatingText("Не удалось улучшить оружие", player.x, player.y - 20, "gray");
    }
}

// Обновление пуль
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        // Для лучей используем особую логику
        if (bullet.type === "beam") {
            // Для луча всегда обновляем начальную точку, чтобы она была на игроке
            bullet.startX = player.x;
            bullet.startY = player.y;

            // Вычисляем конечную точку луча
            const maxDistance = 1000; // Максимальная длина луча
            bullet.x = bullet.startX + bullet.dirX * maxDistance;
            bullet.y = bullet.startY + bullet.dirY * maxDistance;

            // Проверяем столкновение со стенами
            let hitWall = false;
            let currentX = bullet.startX;
            let currentY = bullet.startY;
            const step = 5; // Маленький шаг для проверки столкновений

            while (!hitWall) {
                currentX += bullet.dirX * step;
                currentY += bullet.dirY * step;

                // Проверяем, не слишком ли далеко ушли
                const distFromStart = Math.sqrt(
                    Math.pow(currentX - bullet.startX, 2) +
                    Math.pow(currentY - bullet.startY, 2)
                );
                if (distFromStart > maxDistance) break;

                const tile = getTileAt(currentX, currentY);
                if (tile.isWall) {
                    bullet.x = currentX;
                    bullet.y = currentY;
                    hitWall = true;
                    break;
                }

                // Проверяем столкновения с монстрами
                for (let j = monsters.length - 1; j >= 0; j--) {
                    const monster = monsters[j];
                    const dx = monster.x - currentX;
                    const dy = monster.y - currentY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < monster.size + bullet.size / 2) {
                        // Нанесение урона монстру
                        monster.health -= bullet.damage / 100; // Уменьшенный урон для баланса

                        // Показываем урон
                        showFloatingText(Math.round(bullet.damage / 100).toString(), monster.x, monster.y - monster.size, "white");

                        // Проверка смерти монстра
                        if (monster.health <= 0) {
                            addExperience(monster.xpReward);
                            score += monster.xpReward;
                            updateUI();

                            if (Math.random() < 0.2) {
                                createItem(monster.x, monster.y);
                                showItemPickupText(`Выпал предмет!`, monster.x, monster.y);
                            }

                            monsters.splice(j, 1);
                        }
                    }
                }
            }

            // Лучи существуют только некоторое время
            bullet.lifetime = (bullet.lifetime || 0) + 1;
            if (bullet.lifetime > 30) { // Примерно полсекунды
                bullets.splice(i, 1);
            }
        } else {
            // Перемещение пули
            bullet.x += bullet.dirX * bullet.speed;
            bullet.y += bullet.dirY * bullet.speed;

            // Проверка столкновений со стенами
            const tile = getTileAt(bullet.x, bullet.y);
            if (tile.isWall) {
                if (bullet.bounces < bullet.maxBounces) {
                    // Рикошет
                    const tileX = tile.x * tileSize;
                    const tileY = tile.y * tileSize;

                    // Определяем, с какой стороны стены произошло столкновение
                    const hitLeft = Math.abs(bullet.x - tileX) < Math.abs(bullet.x - (tileX + tileSize));
                    const hitTop = Math.abs(bullet.y - tileY) < Math.abs(bullet.y - (tileY + tileSize));

                    // Определение основного направления столкновения
                    const horizontalHit = Math.abs(bullet.x - tileX) < 5 || Math.abs(bullet.x - (tileX + tileSize)) < 5;
                    const verticalHit = Math.abs(bullet.y - tileY) < 5 || Math.abs(bullet.y - (tileY + tileSize)) < 5;

                    // Добавляем небольшое случайное отклонение для эффекта закручивания
                    const spinFactor = 0.15; // Сила закручивания (можно регулировать)

                    if (horizontalHit) {
                        bullet.dirX = -bullet.dirX;
                        // Добавляем закручивание по Y
                        bullet.dirY += (Math.random() * 2 - 1) * spinFactor;
                    }

                    if (verticalHit) {
                        bullet.dirY = -bullet.dirY;
                        // Добавляем закручивание по X
                        bullet.dirX += (Math.random() * 2 - 1) * spinFactor;
                    }

                    // Нормализуем вектор направления чтобы пуля не ускорялась
                    const length = Math.sqrt(bullet.dirX * bullet.dirX + bullet.dirY * bullet.dirY);
                    bullet.dirX = bullet.dirX / length;
                    bullet.dirY = bullet.dirY / length;

                    // Также добавим небольшое закручивание при каждом обновлении позиции пули
                    // Этот код нужно будет добавить в функцию обновления пули
                    bullet.dirX += (Math.random() * 2 - 1) * 0.01;
                    bullet.dirY += (Math.random() * 2 - 1) * 0.01;

                    // Снова нормализуем после добавления случайности
                    const newLength = Math.sqrt(bullet.dirX * bullet.dirX + bullet.dirY * bullet.dirY);
                    bullet.dirX = bullet.dirX / newLength;
                    bullet.dirY = bullet.dirY / newLength;

                    bullet.bounces++;
                } else {
                    // Пуля исчезает
                    bullets.splice(i, 1);
                }
                continue;
            }

            // Проверка столкновений с монстрами
            for (let j = monsters.length - 1; j >= 0; j--) {
                const monster = monsters[j];
                const dx = monster.x - bullet.x;
                const dy = monster.y - bullet.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < monster.size + bullet.size) {
                    // Нанесение урона монстру
                    monster.health -= bullet.damage;

                    // Показываем урон
                    showFloatingText(Math.round(bullet.damage).toString(), monster.x, monster.y - monster.size, "white");

                    // Удаляем пулю (кроме лучей)
                    if (bullet.type !== "beam") {
                        bullets.splice(i, 1);
                    }

                    // Проверка смерти монстра
                    if (monster.health <= 0) {
                        // Добавляем опыт и очки
                        addExperience(monster.xpReward);
                        score += monster.xpReward;
                        updateUI();

                        // Создаем предмет с вероятностью 20%
                        if (Math.random() < 0.2) {
                            createItem(monster.x, monster.y);
                            showItemPickupText(`Выпал предмет!`, monster.x, monster.y);
                        }

                        monsters.splice(j, 1);
                    }

                    break;
                }
            }

            // Удаляем пули, которые ушли слишком далеко
            const maxDistance = 2000;
            if (Math.abs(bullet.x - player.x) > maxDistance ||
                Math.abs(bullet.y - player.y) > maxDistance) {
                bullets.splice(i, 1);
            }
        }

    }
}

// Обновление монстров
function updateMonsters() {
    // Очищаем массив монстров от тех, кто слишком далеко
    for (let i = monsters.length - 1; i >= 0; i--) {
        const monster = monsters[i];

        // Добавляем и обновляем счетчик жизни монстра, если его нет
        if (!monster.lifeTime) {
            monster.lifeTime = 0;
        }
        monster.lifeTime++;

        // Удаляем монстра, если он живет слишком долго (около 2 минут при 60 FPS)
        if (monster.lifeTime > 7200) {
            monsters.splice(i, 1);
            continue;
        }

        // Вычисляем расстояние до игрока
        const dx = player.x - monster.x;
        const dy = player.y - monster.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Удаляем монстра, если он слишком далеко от игрока
        if (distance > 3000) {
            monsters.splice(i, 1);
            continue;
        }
    }

    for (let monster of monsters) {
        // Движение к игроку только если монстр не слишком далеко
        const dx = player.x - monster.x;
        const dy = player.y - monster.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 800) {
            // Базовое направление к игроку
            let dirX = dx / distance;
            let dirY = dy / distance;

            // Проверяем наличие стен на пути к игроку
            const checkAheadDistance = monster.speed * 2;
            const checkX = monster.x + dirX * checkAheadDistance;
            const checkY = monster.y + dirY * checkAheadDistance;

            // Проверка на стену прямо по пути
            const straightPath = getTileAt(checkX, checkY);

            // Если прямо впереди стена, пытаемся найти обходной путь
            if (straightPath && straightPath.isWall) {
                // Пробуем 8 различных направлений для обхода
                const angleIncrement = Math.PI / 4;
                let bestDirection = null;
                let bestDistance = Infinity;

                for (let i = 0; i < 8; i++) {
                    const angle = i * angleIncrement;
                    const testDirX = Math.cos(angle);
                    const testDirY = Math.sin(angle);

                    const testX = monster.x + testDirX * checkAheadDistance;
                    const testY = monster.y + testDirY * checkAheadDistance;

                    const testTile = getTileAt(testX, testY);

                    if (!testTile || !testTile.isWall) {
                        // Вычисляем, насколько это направление приближает к игроку
                        const distToPlayer = Math.sqrt(
                            Math.pow(player.x - testX, 2) +
                            Math.pow(player.y - testY, 2)
                        );

                        if (distToPlayer < bestDistance) {
                            bestDistance = distToPlayer;
                            bestDirection = { x: testDirX, y: testDirY };
                        }
                    }
                }

                // Если нашли лучшее направление, используем его
                if (bestDirection) {
                    dirX = bestDirection.x;
                    dirY = bestDirection.y;
                }
                // Если не нашли пути, замедляем монстра
                else {
                    dirX *= 0.5;
                    dirY *= 0.5;
                }
            }

            // Рассчитываем новую позицию с учетом скорости
            const newX = monster.x + dirX * monster.speed;
            const newY = monster.y + dirY * monster.speed;

            // Проверка на столкновение с ближайшими стенами
            const tileNewX = getTileAt(newX, monster.y);
            const tileNewY = getTileAt(monster.x, newY);

            // Обновляем позицию только если нет стены
            if (!tileNewX || !tileNewX.isWall) monster.x = newX;
            if (!tileNewY || !tileNewY.isWall) monster.y = newY;
        }
    }

    // Создаем новых монстров периодически
    if (Math.random() < 0.02 && monsters.length < 50) {
        spawnMonster();
    }
}

// Добавление опыта
function addExperience(amount) {
    player.xp += amount;

    // Проверка уровня
    while (player.xp >= player.xpToLevel) {
        player.xp -= player.xpToLevel;
        levelUp();
    }
}

// Повышение уровня
function levelUp() {
    player.level++;
    player.xpToLevel = Math.floor(player.xpToLevel * 1.2);
    player.maxHealth += 20;
    player.health = player.maxHealth;
    player.damage += 5;

    // Улучшаем шанс улучшения оружия
    player.weapon.upgradeChance += 0.01;

    showFloatingText("Уровень повышен!", player.x, player.y - 30, "yellow");
    updateUI();
}

// Показ плавающего текста
function showFloatingText(text, x, y, color) {
    const textElem = document.createElement('div');
    textElem.className = 'floating-text';
    textElem.textContent = text;
    textElem.style.left = (x - cameraOffsetX) + 'px';
    textElem.style.top = (y - cameraOffsetY) + 'px';
    textElem.style.color = color || 'white';

    document.body.appendChild(textElem);

    // Удаляем элемент после анимации
    setTimeout(() => {
        textElem.remove();
    }, 1000);
}

// Показ текста подбора предмета
function showItemPickupText(text, x, y) {
    const textElem = document.createElement('div');
    textElem.className = 'item-pickup';
    textElem.textContent = text;
    textElem.style.left = (x - cameraOffsetX) + 'px';
    textElem.style.top = (y - cameraOffsetY - 30) + 'px';

    document.body.appendChild(textElem);

    // Удаляем элемент после анимации
    setTimeout(() => {
        textElem.remove();
    }, 2000);
}

// Обновление пользовательского интерфейса
function updateUI() {
    uiElements.level.textContent = player.level;
    uiElements.xp.textContent = player.xp;
    uiElements.xpToLevel.textContent = player.xpToLevel;
    uiElements.health.textContent = Math.max(0, Math.round(player.health));
    uiElements.maxHealth.textContent = player.maxHealth;
    uiElements.damage.textContent = player.damage;
    uiElements.attackSpeed.textContent = player.weapon.attackSpeed.toFixed(1);
    uiElements.weaponName.textContent = player.weapon.name;
    uiElements.weaponLevel.textContent = player.weapon.level;
    uiElements.score.textContent = score;
}

// Отрисовка игры
function render() {
    // Обновляем смещение камеры
    cameraOffsetX = player.x - canvas.width / 2;
    cameraOffsetY = player.y - canvas.height / 2;

    // Очищаем холст
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем лабиринт
    const startX = Math.floor(cameraOffsetX / tileSize);
    const startY = Math.floor(cameraOffsetY / tileSize);
    const endX = startX + visibleTiles;
    const endY = startY + visibleTiles;

    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
            const tile = getTileAt(x * tileSize, y * tileSize);

            if (tile.isWall) {
                ctx.fillStyle = '#444';
                ctx.fillRect(
                    tile.x * tileSize - cameraOffsetX,
                    tile.y * tileSize - cameraOffsetY,
                    tileSize,
                    tileSize
                );
            } else {
                ctx.fillStyle = '#111';
                ctx.fillRect(
                    tile.x * tileSize - cameraOffsetX,
                    tile.y * tileSize - cameraOffsetY,
                    tileSize,
                    tileSize
                );
            }
        }
    }

    // Рисуем предметы
    for (let item of items) {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(
            item.x - cameraOffsetX,
            item.y - cameraOffsetY,
            item.size,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    // Рисуем пули
    for (let bullet of bullets) {
        if (bullet.type === "beam") {

            // Рисуем луч
            ctx.strokeStyle = 'cyan';
            ctx.lineWidth = bullet.size;
            ctx.beginPath();
            ctx.moveTo(bullet.startX - cameraOffsetX, bullet.startY - cameraOffsetY);
            ctx.lineTo(bullet.x - cameraOffsetX, bullet.y - cameraOffsetY);
            ctx.stroke();

            // Добавляем свечение
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.lineWidth = bullet.size * 2;
            ctx.beginPath();
            ctx.moveTo(bullet.startX - cameraOffsetX, bullet.startY - cameraOffsetY);
            ctx.lineTo(bullet.x - cameraOffsetX, bullet.y - cameraOffsetY);
            ctx.stroke();

            // Добавляем эффект вспышки на конце луча
            const gradient = ctx.createRadialGradient(
                bullet.x - cameraOffsetX,
                bullet.y - cameraOffsetY,
                0,
                bullet.x - cameraOffsetX,
                bullet.y - cameraOffsetY,
                bullet.size * 2
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(
                bullet.x - cameraOffsetX,
                bullet.y - cameraOffsetY,
                bullet.size * 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
        } else if (bullet.type === "big") {
            // Большая пуля
            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.arc(
                bullet.x - cameraOffsetX,
                bullet.y - cameraOffsetY,
                bullet.size,
                0,
                Math.PI * 2
            );
            ctx.fill();
        } else {
            // Обычная пуля
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(
                bullet.x - cameraOffsetX,
                bullet.y - cameraOffsetY,
                bullet.size,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }

    // Рисуем монстров
    for (let monster of monsters) {
        // Отрисовка монстра с использованием сетки
        const gridSize = 16; // размер нашей сетки 16x16
        const cellSize = monster.size * 2 / gridSize; // размер одной ячейки

        // Позиция верхнего левого угла сетки
        const gridStartX = monster.x - cameraOffsetX - monster.size;
        const gridStartY = monster.y - cameraOffsetY - monster.size;

        // Отрисовка сетки
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                // Если в сетке в этой позиции стоит 1 - рисуем пиксель
                if (monster.type.grid[y][x] === '1') {
                    ctx.fillStyle = monster.type.color;
                    ctx.fillRect(
                        gridStartX + x * cellSize,
                        gridStartY + y * cellSize,
                        cellSize,
                        cellSize
                    );
                }
            }
        }

        // Полоска здоровья
        const healthBarWidth = monster.size * 2;
        const healthBarHeight = 5;
        const healthPercent = monster.health / monster.maxHealth;

        ctx.fillStyle = 'red';
        ctx.fillRect(
            monster.x - cameraOffsetX - healthBarWidth / 2,
            monster.y - cameraOffsetY - monster.size - 10,
            healthBarWidth,
            healthBarHeight
        );

        ctx.fillStyle = 'lime';
        ctx.fillRect(
            monster.x - cameraOffsetX - healthBarWidth / 2,
            monster.y - cameraOffsetY - monster.size - 10,
            healthBarWidth * healthPercent,
            healthBarHeight
        );

        // Имя монстра
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            monster.type.name,
            monster.x - cameraOffsetX,
            monster.y - cameraOffsetY - monster.size - 15
        );
    }



    const gridSize = 16; // размер сетки 16x16
    const cellSize = player.size * 2 / gridSize; // размер одной ячейки

    // Позиция верхнего левого угла сетки
    const gridStartX = player.x - cameraOffsetX - player.size;
    const gridStartY = player.y - cameraOffsetY - player.size;

    // Отрисовка сетки игрока
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            // Если в сетке в этой позиции стоит 1 - рисуем пиксель
            if (player.grid[y][x] === '1') {
                ctx.fillStyle = 'blue'; // цвет игрока
                ctx.fillRect(
                    gridStartX + x * cellSize,
                    gridStartY + y * cellSize,
                    cellSize,
                    cellSize
                );
            }
        }
    }

    // Направление стрельбы
    const dx = mouseX - (player.x - cameraOffsetX);
    const dy = mouseY - (player.y - cameraOffsetY);
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(player.x - cameraOffsetX, player.y - cameraOffsetY);
    ctx.lineTo(
        player.x - cameraOffsetX + Math.cos(angle) * 30,
        player.y - cameraOffsetY + Math.sin(angle) * 30
    );
    ctx.stroke();

    // Полоска здоровья игрока
    const playerHealthBarWidth = player.size * 2;
    const playerHealthBarHeight = 5;
    const playerHealthPercent = player.health / player.maxHealth;

    ctx.fillStyle = 'red';
    ctx.fillRect(
        player.x - cameraOffsetX - playerHealthBarWidth / 2,
        player.y - cameraOffsetY - player.size - 10,
        playerHealthBarWidth,
        playerHealthBarHeight
    );

    ctx.fillStyle = 'lime';
    ctx.fillRect(
        player.x - cameraOffsetX - playerHealthBarWidth / 2,
        player.y - cameraOffsetY - player.size - 10,
        playerHealthBarWidth * playerHealthPercent,
        playerHealthBarHeight
    );

    // Мини-интерфейс
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 180, 60);

    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Уровень: ${player.level}`, 20, 30);
    ctx.fillText(`ОЗ: ${Math.round(player.health)}/${player.maxHealth}`, 20, 50);
    ctx.fillText(`Опыт: ${player.xp}/${player.xpToLevel}`, 20, 70);
}

// Игровой цикл
function gameLoop() {
    if (!gameRunning) return;

    updatePlayer();
    updateBullets();
    updateMonsters();
    render();

    requestAnimationFrame(gameLoop);
}

// Конец игры
function gameOver() {
    gameRunning = false;
    uiElements.finalScore.textContent = score;
    gameOverScreen.style.display = 'block';
}

// Перезапуск игры
function restartGame() {
    // Сбрасываем состояние игры
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.level = 1;
    player.xp = 0;
    player.xpToLevel = 100;
    player.health = 100;
    player.maxHealth = 100;
    player.damage = 10;
    player.weapon = {
        name: "Пистолет",
        level: 1,
        attackSpeed: 1,
        bulletSize: 5,
        bulletSpeed: 5,
        bulletType: "normal",
        upgradeChance: 0.1
    };

    score = 0;
    bullets = [];
    monsters = [];
    items = [];

    gameOverScreen.style.display = 'none';
    gameRunning = true;

    initMaze();
    updateUI();
    gameLoop();
}

// Обработчики событий
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'w') keys.w = true;
    if (e.key.toLowerCase() === 'a') keys.a = true;
    if (e.key.toLowerCase() === 's') keys.s = true;
    if (e.key.toLowerCase() === 'd') keys.d = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'w') keys.w = false;
    if (e.key.toLowerCase() === 'a') keys.a = false;
    if (e.key.toLowerCase() === 's') keys.s = false;
    if (e.key.toLowerCase() === 'd') keys.d = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener('mousedown', () => {
    clicking = true;
});

canvas.addEventListener('mouseup', () => {
    clicking = false;
});

// Мобильное управление (опционально)
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    clicking = true;
    if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
    }
});

canvas.addEventListener('touchend', () => {
    clicking = false;
});

restartButton.addEventListener('click', restartGame);

// Инициализация игры
initMaze();
updateUI();
gameLoop();

// Виртуальные джойстики для мобильных устройств (опционально)
if ('ontouchstart' in window) {
    // Создаем элементы для виртуальных джойстиков
    const createMobileControls = () => {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'mobile-controls';
        controlsContainer.style.position = 'absolute';
        controlsContainer.style.left = '10px';
        controlsContainer.style.bottom = '10px';
        controlsContainer.style.width = '120px';
        controlsContainer.style.height = '120px';
        controlsContainer.style.background = 'rgba(255, 255, 255, 0.3)';
        controlsContainer.style.borderRadius = '60px';
        controlsContainer.style.touchAction = 'none';

        const joystick = document.createElement('div');
        joystick.className = 'joystick';
        joystick.style.position = 'absolute';
        joystick.style.left = '35px';
        joystick.style.top = '35px';
        joystick.style.width = '50px';
        joystick.style.height = '50px';
        joystick.style.background = 'rgba(0, 0, 255, 0.7)';
        joystick.style.borderRadius = '25px';
        joystick.style.touchAction = 'none';

        controlsContainer.appendChild(joystick);
        document.body.appendChild(controlsContainer);

        let active = false;
        let startX = 0;
        let startY = 0;

        controlsContainer.addEventListener('touchstart', (e) => {
            active = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            joystick.style.left = `${e.touches[0].clientX - controlsContainer.getBoundingClientRect().left - 25}px`;
            joystick.style.top = `${e.touches[0].clientY - controlsContainer.getBoundingClientRect().top - 25}px`;
        });

        controlsContainer.addEventListener('touchmove', (e) => {
            if (!active) return;

            const containerRect = controlsContainer.getBoundingClientRect();
            const containerCenterX = containerRect.left + containerRect.width / 2;
            const containerCenterY = containerRect.top + containerRect.height / 2;

            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;

            // Расчет смещения относительно центра
            const dx = touchX - containerCenterX;
            const dy = touchY - containerCenterY;

            // Нормализация расстояния
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = containerRect.width / 2 - 25;

            // Если джойстик слишком далеко от центра, ограничиваем его
            if (distance > maxDistance) {
                const ratio = maxDistance / distance;
                joystick.style.left = `${containerRect.width / 2 + dx * ratio - 25}px`;
                joystick.style.top = `${containerRect.height / 2 + dy * ratio - 25}px`;
            } else {
                joystick.style.left = `${containerRect.width / 2 + dx - 25}px`;
                joystick.style.top = `${containerRect.height / 2 + dy - 25}px`;
            }

            // Расчет направления движения
            keys.w = dy < -10;
            keys.s = dy > 10;
            keys.a = dx < -10;
            keys.d = dx > 10;
        });

        const endTouch = () => {
            active = false;
            joystick.style.left = '35px';
            joystick.style.top = '35px';

            // Сбрасываем все клавиши
            keys.w = false;
            keys.a = false;
            keys.s = false;
            keys.d = false;
        };

        controlsContainer.addEventListener('touchend', endTouch);
        controlsContainer.addEventListener('touchcancel', endTouch);
    };

    createMobileControls();
}
