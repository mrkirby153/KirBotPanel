<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Whoops\Handler\PrettyPageHandler;

class Handler extends ExceptionHandler {
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        \Illuminate\Auth\AuthenticationException::class,
        \Illuminate\Auth\Access\AuthorizationException::class,
        \Symfony\Component\HttpKernel\Exception\HttpException::class,
        \Illuminate\Database\Eloquent\ModelNotFoundException::class,
        \Illuminate\Session\TokenMismatchException::class,
        \Illuminate\Validation\ValidationException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception $exception
     * @return void
     */
    public function report(Exception $exception) {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Exception $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception) {
        if($exception instanceof AuthenticationException){
            if($request->expectsJson()){
                return new Response([
                    "error" => $exception->getMessage()
                ], 401);
            }
        }
        if($this->isHttpException($exception)){
            if($request->expectsJson()){
                return new Response([
                    "error" => ($exception->getMessage())? $exception->getMessage() : "HTTP ".$exception->getStatusCode()
                ], $exception->getStatusCode());
            }
            return $this->renderHttpException($exception);
        }
        if($request->acceptsJson() && !($exception instanceof ValidationException)){
            return new Response([
                'error' => $exception->getMessage(),
            ], 500);
        }
        if(config('app.debug') && !($exception instanceof ValidationException)){
            return $this->renderExceptionWithWhoops($exception);
        }
        return parent::render($request, $exception);
    }

    public function renderExceptionWithWhoops(Exception $e){
        $whoops = new \Whoops\Run();
        $whoops->pushHandler(new PrettyPageHandler());

        return new Response($whoops->handleException($e), $e->getStatusCode(), $e->getHeaders());
    }

    /**
     * Convert an authentication exception into an unauthenticated response.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Illuminate\Auth\AuthenticationException $exception
     * @return \Illuminate\Http\Response
     */
    protected function unauthenticated($request, AuthenticationException $exception) {
        if ($request->expectsJson()) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        return redirect()->guest(route('login'));
    }
}
