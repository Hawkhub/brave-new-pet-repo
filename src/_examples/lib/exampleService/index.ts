// TODO: сформулировать для чего используются сервисы
// сейчас это api-запросы, роутинг, ссылки, роли, внешняя мета, контроль в джоинте
// и прочая бизнес логика уровня фитч или всего приложения

const getFistValue = () => location.origin + '/example';

const getSecondValue = (params: number[]): number => {
    return params.reduce((acc, value) => acc + value, 0);
};

export const exampleService = {
    getFistValue,
    getSecondValue,
};
