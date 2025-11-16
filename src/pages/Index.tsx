import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/157e95b3-e9e1-431d-992f-cac7dff04d18', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.response || 'Извините, произошла ошибка.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Извините, не удалось получить ответ от сервера.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Brain" size={32} className="text-primary" />
              <span className="text-2xl font-bold">LLM Platform</span>
            </div>
            <div className="hidden md:flex gap-6">
              {['home', 'demo', 'features', 'api', 'about', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-sm font-medium hover:text-primary transition-colors capitalize"
                >
                  {section === 'home' ? 'Главная' : section === 'demo' ? 'Демо' : section === 'features' ? 'Возможности' : section === 'api' ? 'API' : section === 'about' ? 'О модели' : 'Контакты'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="container mx-auto px-4 py-24 text-center animate-fade-in">
        <Badge className="mb-4" variant="secondary">
          GPT-4 Turbo Architecture
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Новое поколение
          <br />
          языковых моделей
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Мощная LLM для решения сложных задач: от генерации текста до анализа данных и написания кода
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => scrollToSection('demo')} className="gap-2">
            Попробовать демо
            <Icon name="ArrowRight" size={20} />
          </Button>
          <Button size="lg" variant="outline" onClick={() => scrollToSection('api')}>
            Документация API
          </Button>
        </div>
      </section>

      <section id="demo" className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">Интерактивное демо</h2>
          <p className="text-center text-muted-foreground mb-12">
            Попробуйте возможности модели прямо сейчас
          </p>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="MessageSquare" size={24} />
                Чат с LLM
              </CardTitle>
              <CardDescription>Задайте любой вопрос и получите ответ в реальном времени</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-muted/10">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Icon name="Sparkles" size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Начните диалог с моделью</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card border'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <div className="bg-card border rounded-lg p-4">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
                              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Напишите сообщение..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading}>
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-24 bg-muted/30">
        <h2 className="text-4xl font-bold mb-4 text-center">Возможности модели</h2>
        <p className="text-center text-muted-foreground mb-12">
          Широкий спектр применения для бизнеса и разработки
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: 'FileText',
              title: 'Генерация текста',
              desc: 'Создание статей, описаний продуктов, маркетинговых материалов',
              color: 'text-blue-500',
            },
            {
              icon: 'Code',
              title: 'Помощь в коде',
              desc: 'Написание, объяснение и отладка кода на различных языках',
              color: 'text-green-500',
            },
            {
              icon: 'BarChart',
              title: 'Анализ данных',
              desc: 'Обработка и интерпретация больших объемов информации',
              color: 'text-purple-500',
            },
            {
              icon: 'Languages',
              title: 'Перевод',
              desc: 'Точный перевод текстов на более чем 50 языков',
              color: 'text-orange-500',
            },
            {
              icon: 'BrainCircuit',
              title: 'Контекстное понимание',
              desc: 'Глубокий анализ контекста и нюансов в тексте',
              color: 'text-pink-500',
            },
            {
              icon: 'Zap',
              title: 'Высокая скорость',
              desc: 'Обработка запросов в режиме реального времени',
              color: 'text-yellow-500',
            },
          ].map((feature, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Icon name={feature.icon} size={40} className={feature.color} />
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="api" className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold mb-4 text-center">API Документация</h2>
        <p className="text-center text-muted-foreground mb-12">
          Простая интеграция в ваши приложения
        </p>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="rest" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rest">REST API</TabsTrigger>
              <TabsTrigger value="python">Python SDK</TabsTrigger>
              <TabsTrigger value="node">Node.js SDK</TabsTrigger>
            </TabsList>

            <TabsContent value="rest" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Базовый запрос</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{`POST https://api.llm-platform.dev/v1/chat/completions

{
  "model": "gpt-4-turbo",
  "messages": [
    {"role": "user", "content": "Привет!"}
  ],
  "temperature": 0.7
}`}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="python" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Python пример</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{`from llm_platform import Client

client = Client(api_key="your_api_key")

response = client.chat.completions.create(
    model="gpt-4-turbo",
    messages=[
        {"role": "user", "content": "Привет!"}
    ]
)

print(response.choices[0].message.content)`}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="node" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Node.js пример</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{`const { LLMPlatform } = require('llm-platform');

const client = new LLMPlatform({
  apiKey: 'your_api_key'
});

const response = await client.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [
    { role: 'user', content: 'Привет!' }
  ]
});

console.log(response.choices[0].message.content);`}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section id="about" className="container mx-auto px-4 py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">О модели</h2>
          <p className="text-center text-muted-foreground mb-12">
            Технические характеристики и архитектура
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Cpu" size={24} />
                  Архитектура
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Параметры:</span>
                  <span className="font-medium">175B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Слоёв:</span>
                  <span className="font-medium">96</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heads:</span>
                  <span className="font-medium">96</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Context Length:</span>
                  <span className="font-medium">128K tokens</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Gauge" size={24} />
                  Производительность
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Скорость:</span>
                  <span className="font-medium">~80 tokens/sec</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latency:</span>
                  <span className="font-medium">&lt;500ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span className="font-medium">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Доступность:</span>
                  <span className="font-medium">24/7</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Обучающие данные</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Модель обучена на разнообразном датасете, включающем:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-green-500 mt-0.5" />
                  <span>Научные публикации и исследования</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-green-500 mt-0.5" />
                  <span>Техническую документацию и код</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-green-500 mt-0.5" />
                  <span>Книги и литературные произведения</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-green-500 mt-0.5" />
                  <span>Веб-контент на 50+ языках</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="contact" className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Свяжитесь с нами</h2>
          <p className="text-muted-foreground mb-12">
            Готовы начать использовать нашу LLM платформу?
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Icon name="Mail" size={32} className="mx-auto mb-4 text-primary" />
                <p className="font-medium mb-2">Email</p>
                <p className="text-sm text-muted-foreground">support@llm-platform.dev</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Icon name="MessageCircle" size={32} className="mx-auto mb-4 text-primary" />
                <p className="font-medium mb-2">Telegram</p>
                <p className="text-sm text-muted-foreground">@llm_platform</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Icon name="Github" size={32} className="mx-auto mb-4 text-primary" />
                <p className="font-medium mb-2">GitHub</p>
                <p className="text-sm text-muted-foreground">github.com/llm-platform</p>
              </CardContent>
            </Card>
          </div>

          <Button size="lg" className="gap-2">
            Начать использовать
            <Icon name="ArrowRight" size={20} />
          </Button>
        </div>
      </section>

      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Brain" size={24} className="text-primary" />
              <span className="font-bold">LLM Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 LLM Platform. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;