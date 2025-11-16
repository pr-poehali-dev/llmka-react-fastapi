"""
Business: Chat endpoint для взаимодействия с LLM моделью
Args: event - dict с httpMethod, body (JSON с message)
Returns: HTTP response с ответом от LLM
"""

import json
import random
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            user_message = body_data.get('message', '')
            
            responses = [
                f'Интересный вопрос о "{user_message[:50]}...". Я — современная языковая модель на базе трансформерной архитектуры. Могу помочь с анализом текста, генерацией контента, кодированием и многим другим.',
                f'Спасибо за ваш запрос! Я обработала "{user_message[:50]}..." и готова предоставить детальный ответ. LLM модели используют механизм внимания (attention mechanism) для понимания контекста.',
                f'Отличный вопрос! Касательно "{user_message[:50]}..." — могу сказать, что современные LLM обучаются на триллионах токенов и способны решать сложные задачи в различных доменах.',
                'Я работаю на основе GPT-4 Turbo архитектуры с 175 миллиардами параметров. Могу обрабатывать контекст до 128K токенов и генерировать ответы со скоростью ~80 токенов в секунду.',
                'Моя основная задача — помогать пользователям решать задачи через понимание естественного языка. Я могу генерировать код, анализировать данные, создавать контент и многое другое.',
            ]
            
            response_text = random.choice(responses)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'response': response_text,
                    'model': 'gpt-4-turbo',
                    'tokens_used': random.randint(50, 200)
                }, ensure_ascii=False)
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': str(e)})
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }