# Sociedade dos Poetas Vivos

Uma rede social para poetas. Possibilidade de postar, editar e deletar conteúdo, seguir outros usuários e curtir os posts.

Trabalho desenvolvido em dupla por ![Marcia Silva](https://github.com/marciapsilva) e ![Mayara Ramos](https://github.com/mayaflor).

**Página do projeto:** https://rede-social-filmes.firebaseapp.com/

![image](https://user-images.githubusercontent.com/40531512/47821604-0537f980-dd40-11e8-94a6-90d44a82cc14.png)

## Requisitos

1. Mobile First;
2. Uso de autenticação, banco de dados e hosting do Firebase;
3. Tema: rede social;
4. Cadastro / Login de usuários;
5. Postar, editar e deletar mensagens;
6. Seguir outros usuários da rede;
7. Exibir apenas os posts do usuário logado;
8. Exibir apenas os posts das pessoas que o usuário segue;
9. Exibir todos os posts (os do usuário e das pessoas que segue);
10. (opcional) Curtir o comentário de outros usuários.

## Ferramentas utilizadas

1. Javascript;
2. Jquery;
3. Bootstrap;
4. Firebase;
5. Responsividade;
6. Trello para organização.

## Imagens do site

### Tela de login

![image](https://user-images.githubusercontent.com/40531512/47823361-b2157500-dd46-11e8-9049-84c3558fc2ce.png)

![image](https://user-images.githubusercontent.com/40531512/47823389-dd985f80-dd46-11e8-905b-88e15f1fff5b.png)

### Postar, Editar e Deletar post

![image](https://user-images.githubusercontent.com/40531512/47823483-48499b00-dd47-11e8-8847-66a07b7deced.png)

![image](https://user-images.githubusercontent.com/40531512/47823541-92328100-dd47-11e8-955e-2e04d4a1a80e.png)

![image](https://user-images.githubusercontent.com/40531512/47823599-bee69880-dd47-11e8-866e-ea3fb35a329b.png)

## Organização das tarefas por Kanban

![image](https://user-images.githubusercontent.com/40531512/47823638-f1909100-dd47-11e8-8810-26c99d8d85d2.png)

## Histórico

### Versão 1.0.0 - MVP

Primeira versão do projeto entregue em 16/08/2018. Nesta versão estão disponíveis as seguintes funcionalidades:

- Cadastro e login de usuário; :heavy_check_mark:
- Postar, editar e deletar mensagens; :heavy_check_mark: 
- Postagem com filtro de amigos e público; :heavy_check_mark: 
- Página que exibe apenas os posts do usuário logado; :heavy_check_mark: 
- Página que exibe apenas os posts das pessoas que o usuário segue; :heavy_check_mark: 
- Página que exibe todos os posts (os do usuário e das pessoas que ele segue); :heavy_check_mark: 
- Seguir usuários; :heavy_check_mark: 
- Mobile first. :heavy_check_mark: 

**Problemas conhecidos:**

- Os likes que o usuário dá não são armazenados no banco de dados dele, de forma que, ao carregar a página novamente seus likes anteriores não são exibidos na tela (embora contabilizados) ; :heavy_exclamation_mark:

### Versão 2.0.0 - Em desenvolvimento - Ainda não publicada

Para a versão 2.0.0, desejamos melhorar os seguintes aspectos e implementar as seguintes funcionalidades:

- Trocar a paleta de cores do site para algo que tenha mais a ver com poesia; :heavy_check_mark:
- Colocar os posts em ordem cronológica; :heavy_check_mark:
- Trocar o projeto do firebase para atualizar a url do projeto;
- Possibilidade de dar unfollow nos usuários;
- Impossibilitar que o usuário adicione duas vezes a mesma pessoa;
- Salvar os likes do usuário no banco de dados dele;
- Possibilidade de escolher a fonte que a mensagem do post terá;
- Possibilidade de escolher a cor de fundo que a mensagem postada terá por meio do firestorage;
- Refatorar o código seguindo EcmaScript6.
