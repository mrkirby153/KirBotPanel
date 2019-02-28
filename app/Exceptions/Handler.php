<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Exception $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {
        // Handle JSON
        if ($request->wantsJson() && !($exception instanceof ValidationException)) {
            $response = [
                'errors' => 'Sorry, something went wrong.'
            ];

            if (config('app.debug')) {
                $response['exception'] = get_class($exception);
                $response['message'] = $exception->getMessage();
                $response['trace'] = $exception->getTrace();

                $status = 400;
                if ($exception instanceof ModelNotFoundException) {
                    $status = 404;
                }
                if ($this->isHttpException($exception)) {
                    $status = $exception->getStatusCode();
                }
                if ($status == 0) {
                    $status = 400;
                }
                return response()->json([
                    'success' => false,
                    'code' => $status,
                    'data' => $response,
                ], $status);
            }
        }
        return parent::render($request, $exception);
    }
}
